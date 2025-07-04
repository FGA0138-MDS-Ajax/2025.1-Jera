from app.db.models.usuario import Usuario
from app.db.manager import DBManager

class UsuarioRepository:
    @staticmethod
    def criar(usuario: Usuario):
        with DBManager.get_session_context() as session:
            session.add(usuario)
            session.commit()
            session.refresh(usuario)
            return usuario

    @staticmethod
    def buscar_por_email(email: str):
        with DBManager.get_session_context() as session:
            return session.query(Usuario).filter(Usuario.email == email).first()

    @staticmethod
    def buscar_por_nome(nomeUsuario: str):
        with DBManager.get_session_context() as session:
            return session.query(Usuario).filter(Usuario.nomeUsuario == nomeUsuario).first()