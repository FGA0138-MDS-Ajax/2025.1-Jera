import jwt
from datetime import datetime, timedelta

SECRET_KEY = "floragest_jera_admin"  # Use uma variável de ambiente em produção
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60

def criar_token_jwt(usuario):
    payload = {
        "sub": usuario.email,
        "perfil": usuario.perfil,
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