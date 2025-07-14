from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.db.models.usuario import PerfilEnum
from app.repositories.usuario import UsuarioRepository
from app.routers.schemas.usuario import (
    UsuarioCreateSchema,
    UsuarioJWTSchema,
    UsuarioLoginSchema,
    UsuarioResponseSchema,
    UsuarioPerfilUpdateSchema,
)
from app.services.usuario import UsuarioService
from app.utils.aut_jwt import get_current_user
from app.utils.dependencies import require_profile
from app.utils.logger import Logger

router = APIRouter()
logger = Logger()

@router.get("/usuario/me/debug")
def debug_auth(current_user: Annotated[UsuarioJWTSchema, Depends(get_current_user)]):
    """Debug endpoint to test authentication"""
    return {
        "message": "Authentication working",
        "user_id": current_user.id,
        "user_id_alt": current_user.idUsuario,
        "email": current_user.email,
        "perfil": current_user.perfil
    }

@router.post("/usuario", response_model=UsuarioResponseSchema)
def criar(request: UsuarioCreateSchema):
    """Create a new user with OPERADOR profile only."""
    # Force OPERADOR profile for all new users
    request.perfil = PerfilEnum.OPERADOR
    try:
        return UsuarioService.criar_publico(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

@router.post("/login")
def login(request: UsuarioLoginSchema):
    result = UsuarioService.autenticar(request.email, request.senha)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")

    return result

@router.get("/usuario/me")
def get_me(current_user: Annotated[UsuarioJWTSchema, Depends(get_current_user)]):
    logger.debug(f"JWT User data: id={current_user.id}, idUsuario={current_user.idUsuario}, email={current_user.email}")
    
    # Use idUsuario if id is None for compatibility
    user_id = current_user.id or current_user.idUsuario
    if not user_id:
        logger.error("No valid user ID found in JWT token")
        raise HTTPException(status_code=400, detail="Token JWT inválido: ID do usuário não encontrado")
    
    usuario = UsuarioRepository.buscar_por_id(user_id)
    if not usuario:
        logger.error(f"User not found in database with ID: {user_id}")
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {
        "idUsuario": usuario.idUsuario,
        "nomeUsuario": usuario.nomeUsuario,
        "email": usuario.email,
        "perfil": usuario.perfil
    }

@router.get("/usuario", dependencies=[Depends(require_profile(PerfilEnum.ADMINISTRADOR))])
def listar_usuarios():
    """List all users - only accessible by ADMINISTRADOR."""
    usuarios = UsuarioRepository.listar_todos()
    return [
        {
            "idUsuario": u.idUsuario,
            "nomeUsuario": u.nomeUsuario,
            "email": u.email,
            "perfil": u.perfil.value
        }
        for u in usuarios
    ]

@router.delete("/usuario/{user_id}", dependencies=[Depends(require_profile(PerfilEnum.ADMINISTRADOR))])
def deletar_usuario(user_id: int):
    """Delete a user - only accessible by ADMINISTRADOR."""
    sucesso = UsuarioRepository.deletar(user_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"message": "Usuário deletado com sucesso"}

@router.put("/usuario/{user_id}/perfil", dependencies=[Depends(require_profile(PerfilEnum.ADMINISTRADOR))])
def atualizar_perfil_usuario(user_id: int, request: UsuarioPerfilUpdateSchema):
    """Update user profile - only accessible by ADMINISTRADOR."""
    sucesso = UsuarioRepository.atualizar_perfil(user_id, request.perfil)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"message": "Perfil atualizado com sucesso"}
