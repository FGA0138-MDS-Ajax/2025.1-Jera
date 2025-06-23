from app.db.models.usuario import Usuario
from app.repositories.usuario import UsuarioRepository

class UsuarioService:
    @staticmethod
    def criar(usuario_data):
        #verificador
        if UsuarioRepository.buscar_por_nome(usuario_data.nomeUsuario):
            raise ValueError("Nome de usuário já cadastrado.")
        if UsuarioRepository.buscar_por_email(usuario_data.email):
            raise ValueError("Email já cadastrado.")
        usuario = Usuario(
            nomeUsuario=usuario_data.nomeUsuario,
            email=usuario_data.email,
            senha=usuario_data.senha  # senha em texto puro (temporário, sem proteção)
        )
        return UsuarioRepository.criar(usuario)

    @staticmethod
    def autenticar(email: str, senha: str):
        usuario = UsuarioRepository.buscar_por_email(email)
        if usuario and usuario.senha == senha:  # comparação simples (temporário)
            return usuario
        return None