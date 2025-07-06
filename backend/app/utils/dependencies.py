from fastapi import Depends, HTTPException, status
from app.utils.aut_jwt import get_current_user

def require_admin(current_user=Depends(get_current_user)):
    if current_user.perfil != "ADMINISTRADOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem realizar esta ação."
        )
    return current_user

def require_gerente(current_user=Depends(get_current_user)):
    if current_user.perfil != "GERENTE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas gerentes podem realizar esta ação."
        )
    return current_user

def require_operador(current_user=Depends(get_current_user)):
    if current_user.perfil != "OPERADOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas operadores podem realizar esta ação."
        )
    return current_user