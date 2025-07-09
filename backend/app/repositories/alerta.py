from sqlalchemy.orm import Session
from app.db.models.alerta import Alerta
from app.db.models.product import Product
from app.utils.session_inject import with_session
from datetime import datetime, timedelta
from app.db.models.estado_estetico import EstadoEstetico
from app.db.models.tipo_alerta import TipoAlerta
from app.repositories.estatistics_moda import calcular_moda_estado_estetico
from app.repositories.movimentacao_estoque import MovimentacaoEstoqueRepository

class AlertaRepository:

    @staticmethod
    def alerta_existe(id_produto: int, id_tipo_alerta: int, mensagem: str, id_lote: int, session) -> bool:
        return session.query(Alerta).filter_by(
            id_produto=id_produto,
            id_tipo_alerta=id_tipo_alerta,
            mensagem=mensagem,
            id_lote=id_lote
        ).first() is not None

    @staticmethod
    @with_session
    def gerar_alertas_baixo_giro(subq, dias_sem_giro: int, session: Session = None) -> list[Alerta]:
        """
        Gera alertas para produtos sem movimentação nos últimos X dias (baixo giro).
        """
        tipo_alerta_baixo_giro = session.query(TipoAlerta).filter(
            TipoAlerta.nome_tipo_alerta.ilike("%baixo giro%")
        ).first()
        if not tipo_alerta_baixo_giro:
            tipo_alerta_baixo_giro = TipoAlerta(nome_tipo_alerta="Baixo Giro")
            session.add(tipo_alerta_baixo_giro)
            session.commit()
            session.refresh(tipo_alerta_baixo_giro)

        produtos_baixo_giro = session.query(Product).filter(~Product.id_produto.in_(subq)).all()
        alertas_gerados = []
        for produto in produtos_baixo_giro:
            existe = session.query(Alerta).filter(
                Alerta.id_produto == produto.id_produto,
                Alerta.id_tipo_alerta == tipo_alerta_baixo_giro.id_tipo_alerta,
                Alerta.mensagem.ilike("%baixo giro%")
            ).first()
            if not existe:
                alerta = Alerta(
                    id_produto=produto.id_produto,
                    id_tipo_alerta=tipo_alerta_baixo_giro.id_tipo_alerta,
                    mensagem=f"Produto '{produto.nome_produto}' sem movimentação há {dias_sem_giro} dias (baixo giro)",
                    id_lote=None
                )
                session.add(alerta)
                alertas_gerados.append(alerta)
        session.commit()
        return alertas_gerados

    @staticmethod
    @with_session
    def gerar_alertas_lotes_ruins_3dias(session: Session | None = None) -> list[Alerta]:
        """
        Gera alertas para lotes que estão no estado estético 'ruim' (de acordo com a moda das movimentações)
        há mais de 3 dias.
        """
        tres_dias_atras = datetime.now() - timedelta(days=3)

        # Busca o estado estético "ruim"
        estado_ruim = session.query(EstadoEstetico).filter(
            EstadoEstetico.nome_estado_estetico.ilike("ruim")
        ).first()
        if not estado_ruim:
            return []

        # Garante que o tipo de alerta existe
        tipo_alerta = session.query(TipoAlerta).filter(TipoAlerta.id_tipo_alerta == 99).first()
        if not tipo_alerta:
            tipo_alerta = TipoAlerta(id_tipo_alerta=99, nome_tipo_alerta="Lotes ruins há mais de 3 dias")
            session.add(tipo_alerta)
            session.commit()
            session.refresh(tipo_alerta)

        alertas_gerados = []
        from app.db.models.lote import Lote
        lotes = session.query(Lote).filter(Lote.data_entrada < tres_dias_atras).all()
        for lote in lotes:
            movimentacoes = MovimentacaoEstoqueRepository.listar_por_lote(lote.id_lote, session=session)
            id_moda = calcular_moda_estado_estetico(movimentacoes)
            if id_moda == estado_ruim.id_estado_estetico:
                mensagem = f"Lote {lote.id_lote} está no estado RUIM há mais de 3 dias."
                if not AlertaRepository.alerta_existe(lote.id_produto, tipo_alerta.id_tipo_alerta, mensagem, lote.id_lote, session):
                    alerta = Alerta(
                        id_produto=lote.id_produto,
                        id_tipo_alerta=tipo_alerta.id_tipo_alerta,
                        id_lote=lote.id_lote,
                        mensagem=mensagem
                    )
                    session.add(alerta)
                    alertas_gerados.append(alerta)
        session.commit()
        return alertas_gerados

    @staticmethod
    @with_session
    def gerar_alerta(id_produto: int, id_tipo_alerta: int, mensagem: str, id_lote:int, session: Session | None = None) -> Alerta:
        """
        Cria um alerta de acordo com o ID do produto e o tipo de alerta.
        Só é acionado caso o alerta ainda não exista.
        """
        if AlertaRepository.alerta_existe(id_produto, id_tipo_alerta, mensagem, id_lote, session):
            return None  # Não cria alerta duplicado
        
        alerta = Alerta(
            id_produto=id_produto,
            id_tipo_alerta=id_tipo_alerta,
            id_lote=id_lote,
            mensagem=mensagem
        )
        session.add(alerta)
        session.commit()
        session.refresh(alerta)
        return alerta

    @staticmethod
    def get_or_create_tipo_alerta(id_tipo_alerta: int, nome_tipo_alerta: str, session: Session) -> TipoAlerta:
        tipo_alerta = session.query(TipoAlerta).filter(TipoAlerta.id_tipo_alerta == id_tipo_alerta).first()
        if not tipo_alerta:
            tipo_alerta = TipoAlerta(id_tipo_alerta=id_tipo_alerta, nome_tipo_alerta=nome_tipo_alerta)
            session.add(tipo_alerta)
            session.commit()
            session.refresh(tipo_alerta)
        return tipo_alerta

    @staticmethod
    @with_session
    def verificar_e_gerar_alerta(produto: Product, estoque_atual: int, id_lote: int, session: Session | None = None) -> list[Alerta]:
        alertas_gerados = []
        
        tipo_min = AlertaRepository.get_or_create_tipo_alerta(1, "Estoque abaixo do mínimo", session)
        tipo_max = AlertaRepository.get_or_create_tipo_alerta(2, "Estoque acima do máximo", session)
        tipo_prev_min = AlertaRepository.get_or_create_tipo_alerta(3, "Preventivo mínimo", session)
        tipo_prev_max = AlertaRepository.get_or_create_tipo_alerta(4, "Preventivo máximo", session)

        margem_min = 0.5
        margem_max = 0.1
        limite_prev_min = produto.estoque_minimo + int(produto.estoque_minimo * margem_min)
        limite_prev_max = produto.estoque_maximo - int(produto.estoque_maximo * margem_max) if produto.estoque_maximo else None

        if estoque_atual < produto.estoque_minimo:
            mensagem = f"Estoque abaixo do mínimo: {estoque_atual} < {produto.estoque_minimo}"
            alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_min.id_tipo_alerta, mensagem, id_lote, session)
            alertas_gerados.append(alerta)
        elif estoque_atual <= limite_prev_min:
            mensagem = f"Atenção: Estoque próximo do mínimo ({produto.estoque_minimo})"
            alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_prev_min.id_tipo_alerta, mensagem, id_lote, session)
            alertas_gerados.append(alerta)

        if produto.estoque_maximo:
            if estoque_atual > produto.estoque_maximo:
                mensagem = f"Estoque acima do máximo: {estoque_atual} > {produto.estoque_maximo}"
                alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_max.id_tipo_alerta, mensagem, id_lote, session)
                alertas_gerados.append(alerta)
            elif estoque_atual >= limite_prev_max:
                mensagem = f"Atenção: Estoque próximo do máximo ({produto.estoque_maximo})"
                alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_prev_max.id_tipo_alerta, mensagem, id_lote, session)
                alertas_gerados.append(alerta)

        # Exemplo de uso para baixo giro e lotes ruins:
        # Defina dias_sem_giro e subq conforme sua lógica de negócio
        dias_sem_giro = 15
        data_limite = datetime.now() - timedelta(days=dias_sem_giro)
        from app.db.models.movimentacao_estoque import MovimentacaoEstoque
        subq = session.query(MovimentacaoEstoque.id_produto).filter(
            MovimentacaoEstoque.data_movimentacao >= data_limite
        ).distinct()

        alertas_gerados += AlertaRepository.gerar_alertas_lotes_ruins_3dias(session=session)
        alertas_gerados += AlertaRepository.gerar_alertas_baixo_giro(subq, dias_sem_giro, session=session)
        return [a for a in alertas_gerados if a is not None]

    @staticmethod
    @with_session
    def get_all_alerta(session: Session | None = None) -> list[Alerta]:
        return session.query(Alerta).all()

    @staticmethod
    @with_session
    def get_alerta_by_id(id_alerta: int, session: Session | None = None) -> Alerta | None:
        return session.get(Alerta, id_alerta)
    
    @staticmethod
    @with_session
    def get_alerta_by_product(id_produto: int, session: Session | None = None) -> list[Alerta]:
        return session.query(Alerta).filter(Alerta.id_produto == id_produto).all()
    
    @staticmethod
    @with_session
    def delete_alerta(id_alerta: int, session: Session | None = None) -> bool:
        alerta = session.get(Alerta, id_alerta)
        if alerta:
            session.delete(alerta)
            session.commit()
            return True
        else:
            return False

    @staticmethod
    @with_session
    def delete_all_alerta(session: Session | None = None) -> None:
        session.query(Alerta).delete()
        session.commit()