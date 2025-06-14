from sqlalchemy.orm import Session
from app.db.models.tipo_alerta import TipoAlerta
from app.utils.session_inject import with_session

class TipoAlertaRepository:

    @staticmethod
    @with_session
    def create_tipo_alerta(tipo_alerta_data: TipoAlerta, session: Session | None = None) -> TipoAlerta:
        """
        Cria um novo tipo de alerta no banco de dados.
        """
        session.add(tipo_alerta_data)
        session.flush()
        session.refresh(tipo_alerta_data)
        return tipo_alerta_data

    @staticmethod
    @with_session
    def get_tipo_alerta_by_id(id_tipo_alerta: int, session: Session | None = None) -> TipoAlerta | None:
        """
        Busca um tipo de alerta pelo seu ID.
        """
        return session.get(TipoAlerta, id_tipo_alerta)

    @staticmethod
    @with_session
    def get_all_tipo_alertas(session: Session | None = None) -> list[TipoAlerta]:
        """
        Recupera todos os tipos de alerta cadastrados no banco de dados.
        """
        return session.query(TipoAlerta).all()

    @staticmethod
    @with_session
    def update_tipo_alerta(tipo_alerta_data: TipoAlerta, session: Session | None = None) -> TipoAlerta | None:
        """
        Atualiza um tipo de alerta existente com os dados fornecidos.
        """
        db_tipo_alerta = session.get(TipoAlerta, tipo_alerta_data.id_tipo_alerta)
        if not db_tipo_alerta:
            return None
        for attr, value in tipo_alerta_data.model_dump(exclude_unset=True).items():
            setattr(db_tipo_alerta, attr, value)
        session.commit()
        session.refresh(db_tipo_alerta)
        return db_tipo_alerta

    @staticmethod
    @with_session
    def delete_tipo_alerta(id_tipo_alerta: int, session: Session | None = None) -> None:
        """
        Remove um tipo de alerta pelo seu ID.
        """
        db_tipo_alerta = session.get(TipoAlerta, id_tipo_alerta)
        if db_tipo_alerta:
            session.delete(db_tipo_alerta)
            session.commit()
            
        