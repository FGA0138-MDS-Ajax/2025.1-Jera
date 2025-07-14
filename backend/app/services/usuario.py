from app.db.models.usuario import PerfilEnum, Usuario
from app.repositories.usuario import UsuarioRepository
from app.routers.schemas.usuario import UsuarioCreateSchema
from app.utils.aut_jwt import criar_token_jwt
from app.utils.logger import Logger
from app.utils.senha_cripto import hash_password, verify_password

logger = Logger()

class UsuarioService:
    @staticmethod
    def autenticar(email: str, senha: str) -> dict | None:
        usuario = UsuarioRepository.buscar_por_email(email)
        if usuario and verify_password(senha, usuario.senha):
            token = criar_token_jwt(usuario)
            return {"access_token": token, "token_type": "bearer", "perfil": usuario.perfil}
        return None

    @staticmethod
    def criar_publico(usuario_data: UsuarioCreateSchema) -> Usuario:
        """Create a new user with OPERADOR profile only. For public registration."""
        logger.debug("Iniciando criação de usuário público com dados: %s", usuario_data)
        
        # Force OPERADOR profile for public registration
        usuario_data.perfil = PerfilEnum.OPERADOR
        
        if UsuarioRepository.buscar_por_email(usuario_data.email):
            msg = "Email já cadastrado."
            raise ValueError(msg)

        usuario = Usuario(
            nomeUsuario=usuario_data.nomeUsuario,
            email=usuario_data.email,
            senha=hash_password(usuario_data.senha),
            perfil=PerfilEnum.OPERADOR,  # Always OPERADOR for public registration
        )
        return UsuarioRepository.criar(usuario)
