from sqlalchemy.orm import Session

from app.db.manager import DBManager
from app.db.models.usuario import Usuario
from app.utils.session_inject import with_session


class UsuarioRepository:
    @staticmethod
    @with_session
    def criar(usuario: Usuario, session: Session | None = None) -> Usuario:
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return usuario

    @staticmethod
    @with_session
    def buscar_por_email(email: str, session: Session | None = None) -> Usuario | None:
        return session.query(Usuario).filter(Usuario.email == email).first()

    @staticmethod
    @with_session
    def buscar_por_id(id_usuario: int, session: Session | None = None) -> Usuario | None:
        return session.query(Usuario).filter(Usuario.idUsuario == id_usuario).first()

    @staticmethod
    @with_session
    def listar_todos(session: Session | None = None) -> list[Usuario]:
        return session.query(Usuario).all()

    @staticmethod
    @with_session
    def deletar(id_usuario: int, session: Session | None = None) -> bool:
        usuario = session.query(Usuario).filter(Usuario.idUsuario == id_usuario).first()
        if usuario:
            session.delete(usuario)
            session.commit()
            return True
        return False

    @staticmethod
    @with_session
    def atualizar_perfil(id_usuario: int, novo_perfil, session: Session | None = None) -> bool:
        usuario = session.query(Usuario).filter(Usuario.idUsuario == id_usuario).first()
        if usuario:
            usuario.perfil = novo_perfil
            session.commit()
            return True
        return False
