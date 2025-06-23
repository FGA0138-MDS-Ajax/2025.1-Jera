from fastapi import APIRouter, HTTPException
from app.routers.schemas.usuario import UsuarioCreateSchema, UsuarioLoginSchema, UsuarioResponseSchema
from app.services.usuario import UsuarioService

router = APIRouter()

@router.post("/usuario", response_model=UsuarioResponseSchema)
def criar(request: UsuarioCreateSchema):
    try:
        usuario = UsuarioService.criar(request)
        return usuario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=UsuarioResponseSchema)
def login(request: UsuarioLoginSchema):
    usuario = UsuarioService.autenticar(request.email, request.senha)
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    return usuario