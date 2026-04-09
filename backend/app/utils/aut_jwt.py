import datetime as dt
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config.settings import Settings
from app.db.models.usuario import Usuario
from app.routers.schemas.usuario import UsuarioJWTSchema
from app.utils.logger import Logger

config = Settings()
logger = Logger()

auth_scheme = HTTPBearer(auto_error=False)


def criar_token_jwt(usuario: Usuario) -> str:
    payload = UsuarioJWTSchema(
        id=usuario.idUsuario,
        idUsuario=usuario.idUsuario,  # Add both fields for compatibility
        email=usuario.email,
        perfil=usuario.perfil,
        expiration_time=dt.datetime.now(tz=dt.UTC) + dt.timedelta(minutes=config.EXPIRE_MINUTES),
    )
    return jwt.encode(payload.model_dump(mode="json"), config.SECRET_KEY, algorithm=config.ALGORITHM)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(auth_scheme)],
) -> UsuarioJWTSchema:
    if not credentials:
        logger.debug("No credentials provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso obrigatório.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    if not token:
        logger.debug("Empty token provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso inválido.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        logger.debug(f"Decodificando token JWT: {token[:20]}...")  # Only log first 20 chars for security
        decoded = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return UsuarioJWTSchema(**decoded)
    except jwt.ExpiredSignatureError as e:
        logger.debug(f"Token expirado: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
    except jwt.InvalidTokenError as e:
        logger.debug(f"Token inválido: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
    except Exception as e:
        logger.error(f"Erro inesperado ao decodificar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Erro de autenticação.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
