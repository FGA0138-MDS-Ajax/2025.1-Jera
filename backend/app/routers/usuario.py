from fastapi import APIRouter, HTTPException
from app.routers.schemas.usuario import UsuarioCreateSchema, UsuarioLoginSchema, UsuarioResponseSchema
from app.services.usuario import UsuarioService, UsuarioRepository

router = APIRouter()

@router.post("/usuario", response_model=UsuarioResponseSchema)
def criar(request: UsuarioCreateSchema):
    try:
        usuario = UsuarioService.criar(request)
        return usuario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(request: UsuarioLoginSchema):
    result = UsuarioService.autenticar(request.email, request.senha)
    if not result:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    usuario = UsuarioRepository.buscar_por_email(request.email)
    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "perfil": usuario.perfil
    }