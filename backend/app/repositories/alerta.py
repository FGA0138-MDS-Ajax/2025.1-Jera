from sqlalchemy.orm import Session
from app.db.models.alerta import Alerta
from app.utils.session_inject import with_session

class AlertaRepository:

    @staticmethod
    @with_session
    def gerar_alerta(id_produto: int, tipo_alerta: str, mensagem: str, session: Session | None = None) -> Alerta:
        """
        Crie um alerta de acordo com o ID do produto e o tipo de alerta
        *Só é acionado caso o services/alerta.py função verificarAlerta atender os requisitos*

        Args:
            id_produto (int): ID do produto que será gerado o alerta.
            tipo_alerta (str): Tipo de alerta a ser gerado (Ex: ESTOQUE_MINIMO)
            mensagem (str): Mensagem descritiva do alerta.
            session (Session, opcional):  Sessão do banco de dados injetado automaticamente.

        Returns:
            alerta: alerta gerado
        """
        alerta = Alerta(
            id_produto=id_produto,
            tipo_alerta=tipo_alerta,
            mensagem=mensagem
        )
        session.add(alerta)
        session.commit()
        session.refresh(alerta)
        return alerta
    
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
        return session.query(Alerta)._filter(Alerta.id_produto == id_produto).all()
    
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