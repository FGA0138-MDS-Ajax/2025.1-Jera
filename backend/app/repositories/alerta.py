from sqlalchemy.orm import Session
from app.db.models.alerta import Alerta
from app.db.models.product import Product
from app.utils.session_inject import with_session
from app.services.tipo_alerta import TipoAlertaService
class AlertaRepository:

    @staticmethod
    @with_session
    def gerar_alerta(id_produto: int, tipo_alerta: str, mensagem: str, session: Session | None = None) -> Alerta:
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
        alerta = Alerta(
            id_produto=id_produto,
            id_tipo_alerta=tipo_alerta,
            mensagem=mensagem
        )
        session.add(alerta)
        session.commit()
        session.refresh(alerta)
        return alerta
    
    @staticmethod
    @with_session
    def verificar_e_gerar_alerta(produto: Product, estoque_atual: int, session: Session | None = None) -> list[Alerta]:

        alertas_gerados = []

        # IDs dos tipos de alerta (ajuste conforme seu banco)
        tipo_min = TipoAlertaService.get_tipo_alerta_by_id(1)  # Estoque abaixo do mínimo
        tipo_max = TipoAlertaService.get_tipo_alerta_by_id(2)  # Estoque acima do máximo
        tipo_prev_min = TipoAlertaService.get_tipo_alerta_by_id(3)  # Preventivo mínimo
        tipo_prev_max = TipoAlertaService.get_tipo_alerta_by_id(4)  # Preventivo máximo

        # Alerta preventivo: 10% acima do mínimo ou 10% abaixo do máximo
        margem_min = 0.5
        margem_max = 0.1
        limite_prev_min = produto.estoque_minimo + int(produto.estoque_minimo * margem_min)
        limite_prev_max = produto.estoque_maximo - int(produto.estoque_maximo * margem_max) if produto.estoque_maximo else None
        
        
        if estoque_atual < produto.estoque_minimo:
            mensagem = f"Estoque abaixo do mínimo: {estoque_atual} < {produto.estoque_minimo}"
            alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_min.id_tipo_alerta, mensagem)
            alertas_gerados.append(alerta)
        elif estoque_atual <= limite_prev_min:
            mensagem = f"Atenção: Estoque próximo do mínimo ({estoque_atual} <= {limite_prev_min})"
            alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_prev_min.id_tipo_alerta, mensagem)
            alertas_gerados.append(alerta)

        if produto.estoque_maximo:
            if estoque_atual > produto.estoque_maximo:
                mensagem = f"Estoque acima do máximo: {estoque_atual} > {produto.estoque_maximo}"
                alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_max.id_tipo_alerta, mensagem)
                alertas_gerados.append(alerta)
            elif estoque_atual >= limite_prev_max:
                mensagem = f"Atenção: Estoque próximo do máximo ({estoque_atual} >= {limite_prev_max})"
                alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_prev_max.id_tipo_alerta, mensagem)
                alertas_gerados.append(alerta)

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
    def delete_alerta(id_alerta: int, session: Session | None = None) -> None:
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

    @staticmethod
    @with_session
    def delete_all_alerta(session: Session | None = None) -> None:
        session.query(Alerta).delete()
        session.commit()