from app.db.models.usuario import Usuario
from app.repositories.usuario import UsuarioRepository
from app.utils.senha_cripto import hash_password, verify_password

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
            senha=hash_password(usuario_data.senha)  # senha criptografada
        )
        return UsuarioRepository.criar(usuario)

    @staticmethod
    def autenticar(email: str, senha: str):
        usuario = UsuarioRepository.buscar_por_email(email)
        if usuario and verify_password(senha, usuario.senha):  # compara hash
            return usuario
        return None