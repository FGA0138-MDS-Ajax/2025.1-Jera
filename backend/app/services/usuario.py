from app.db.models.usuario import Usuario, PerfilEnum
from app.repositories.usuario import UsuarioRepository
from app.utils.senha_cripto import hash_password, verify_password
from app.utils.aut_jwt import criar_token_jwt

class UsuarioService:
    @staticmethod
    def criar(usuario_data):
        perfil_normalizado = usuario_data.perfil.upper()
        if UsuarioRepository.buscar_por_nome(usuario_data.nomeUsuario):
            raise ValueError("Nome de usuário já cadastrado.")
        if UsuarioRepository.buscar_por_email(usuario_data.email):
            raise ValueError("Email já cadastrado.")
        if perfil_normalizado not in [p.value for p in PerfilEnum]:
            raise ValueError("Perfil inválido. Use: Operador, Gerente ou Administrador.")
        usuario = Usuario(
            nomeUsuario=usuario_data.nomeUsuario,
            email=usuario_data.email,
            senha=hash_password(usuario_data.senha),
            perfil=perfil_normalizado
        )
        return UsuarioRepository.criar(usuario)

    @staticmethod
    def autenticar(email: str, senha: str):
        usuario = UsuarioRepository.buscar_por_email(email)
        if usuario and verify_password(senha, usuario.senha):
            token = criar_token_jwt(usuario)
            return {"access_token": token, "token_type": "bearer"}
        return None