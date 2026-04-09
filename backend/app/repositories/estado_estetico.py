from sqlalchemy.orm import Session
from sqlmodel import select
from app.db.models.estado_estetico import EstadoEstetico
from app.utils.session_inject import with_session

class EstadoEsteticoRepository:

    @staticmethod
    @with_session
    def criar_estado(nome_estado: str, session: Session = None) -> EstadoEstetico:
        estado = EstadoEstetico(nome_estado_estetico=nome_estado)
        session.add(estado)
        session.commit()
        session.refresh(estado)
        return estado

    @staticmethod
    @with_session
    def listar_estados(session: Session = None) -> list[EstadoEstetico]:
        return session.query(EstadoEstetico).all()
    @staticmethod
    @with_session
    def get_estado_by_id(id_estado: int, session: Session = None) -> EstadoEstetico | None:
        return session.get(EstadoEstetico, id_estado)
    
    @staticmethod
    @with_session
    def deletar_estado(id_estado:int, session: Session | None = None) -> None:
        estado = session.get(EstadoEstetico, id_estado)
        if estado:
            session.delete(estado)
            session.commit()



    @staticmethod
    @with_session
    def update_estado_estetico(id_estado_estetico: int, data, session: Session = None) -> EstadoEstetico | None:
        estado = session.get(EstadoEstetico, id_estado_estetico)
        if not estado:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(estado, key, value)
        session.commit()
        session.refresh(estado)
        return estado