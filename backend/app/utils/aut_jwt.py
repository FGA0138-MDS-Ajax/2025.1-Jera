import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "floragest_jera_admin"
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60

auth_scheme = HTTPBearer()

def criar_token_jwt(usuario):
    payload = {
        "sub": usuario.email,
        "perfil": usuario.perfil,
        "idUsuario": usuario.idUsuario,
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decodificar_token_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    payload = decodificar_token_jwt(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado."
        )

    class User:
        def __init__(self, email, perfil):
            self.email = email
            self.perfil = perfil
    return User(email=payload.get("sub"), perfil=payload.get("perfil"))