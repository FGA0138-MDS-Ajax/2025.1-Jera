from typing import Annotated

from fastapi import Depends, HTTPException, status

from app.db.models.usuario import PerfilEnum
from app.routers.schemas.usuario import UsuarioJWTSchema as User
from app.utils.aut_jwt import get_current_user
from app.utils.logger import Logger

logger = Logger()

def require_profile(required_profile: PerfilEnum):
    """
    Requires a minimum profile level for access.
    Hierarchy: OPERADOR < GERENTE < ADMINISTRADOR
    """
    logger.debug(f"Perfil requerido: {required_profile}")
    
    def _require_profile(current_user: Annotated[User, Depends(get_current_user)]):
        logger.debug(f"Verificando perfil do usuário: {current_user}")
        
        # Define the hierarchy
        profile_hierarchy = {
            PerfilEnum.OPERADOR: 1,
            PerfilEnum.GERENTE: 2,
            PerfilEnum.ADMINISTRADOR: 3
        }
        
        user_level = profile_hierarchy.get(current_user.perfil, 0)
        required_level = profile_hierarchy.get(required_profile, 0)
        
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso negado. Perfil necessário: {required_profile.value}. Seu perfil: {current_user.perfil.value}.",
            )

        return current_user

    return _require_profile
