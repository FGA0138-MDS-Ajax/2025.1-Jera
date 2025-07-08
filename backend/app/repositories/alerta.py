from sqlalchemy.orm import Session
from app.db.models.alerta import Alerta
from app.db.models.product import Product
from app.utils.session_inject import with_session
from app.services.tipo_alerta import TipoAlertaService
from datetime import datetime, timedelta
from app.db.models.estado_estetico import EstadoEstetico
from app.db.models.tipo_alerta import TipoAlerta
from app.repositories.estatistics_moda import calcular_moda_estado_estetico
from app.repositories.movimentacao_estoque import MovimentacaoEstoqueRepository

#timedelta() representa uma diferença de tempo, podendo ser dias, horas, minutos, etc...
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
    def gerar_alertas_lotes_ruins_3dias(session: Session | None = None) -> list[Alerta]:
        """
        Gera alertas para lotes que estão no estado estético 'ruim' (de acordo com a moda das movimentações)
        há mais de 3 dias.

        O alerta é criado apenas se ainda não existir para o lote/produto.
        O tipo de alerta utilizado é "Lotes ruins há mais de 7 dias" (id_tipo_alerta=99).
        O estado predominante do lote é calculado dinamicamente a partir das movimentações de estoque.

        Parâmetros:
            session (Session, opcional): Sessão do banco de dados.

        Retorna:
            list[Alerta]: Lista de alertas gerados nesta execução.
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
        # Busca todos os lotes com data de entrada há mais de 3 dias
        from app.db.models.lote import Lote
        lotes = session.query(Lote).filter(Lote.data_entrada < tres_dias_atras).all()
        for lote in lotes:
            # Busca as movimentações do lote
            movimentacoes = MovimentacaoEstoqueRepository.listar_por_lote(lote.id_lote, session=session)
            # Calcula a moda do estado estético das movimentações
            id_moda = calcular_moda_estado_estetico(movimentacoes)
            # Se a moda for "ruim", gera o alerta (se ainda não existir)
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
        Crie um alerta de acordo com o ID do produto e o tipo de alerta
        *Só é acionado caso o services/alerta.py função verificarAlerta atender os requisitos*

        Args:
            id_produto (int): ID do produto que será gerado o alerta.
            tipo_alerta (int): Tipo de alerta a ser gerado (Ex: '1' para ESTOQUE_MINIMO)
            mensagem (str): Mensagem descritiva do alerta.
            session (Session, opcional):  Sessão do banco de dados injetado automaticamente.

        Returns:
            alerta: alerta gerado
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
        
        # IDs dos tipos de alerta (ajuste conforme seu banco)
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

        alertas_gerados += AlertaRepository.gerar_alertas_lotes_ruins_3dias(session=session)
        return alertas_gerados
    

    @staticmethod
    @with_session
    def get_all_alerta(session: Session | None = None) -> list[Alerta]:
        return session.query(Alerta).all()


    @staticmethod
    @with_session
    def get_alerta_by_id(id_alerta: int, session: Session | None = None) -> Alerta | None:
        """
        Busca um alerta por ID

        Args: 
            id_alerta (int): ID do alerta a ser buscado
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        return
            Alerta | None: Alerta encontrado ou None caso não encontre nada
        """
        return session.get(Alerta, id_alerta)
    
    @staticmethod
    @with_session
    def get_alerta_by_product(id_produto: int, session: Session | None = None) -> list[Alerta]:
        """
        Busca os alertas pelo ID do produto

        Args:
            id_produto (int): ID do produto a se usar como filtro
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.
        
        Returns:
            list[Alerta]: lista de alertas encontra daquele ID
        """
        return session.query(Alerta).filter(Alerta.id_produto == id_produto).all()
    
    @staticmethod
    @with_session
    def delete_alerta(id_alerta: int, session: Session | None = None) -> bool:
        """
        Remove um alerta pelo seu ID.

        Args:
            id_alerta (int): ID do alerta a ser removido.
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        Returns:
            None
        """
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