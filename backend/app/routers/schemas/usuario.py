from datetime import datetime

from pydantic import BaseModel, model_validator

from app.db.models.usuario import PerfilEnum


class UsuarioCreateSchema(BaseModel):
    nomeUsuario: str
    email: str
    senha: str
    confirme_sua_senha: str
    perfil: PerfilEnum | None = PerfilEnum.OPERADOR

    @model_validator(mode="after")
    def senhas_iguais(self):
        if self.senha != self.confirme_sua_senha:
            raise ValueError('As senhas não coincidem.')
        return self

class UsuarioLoginSchema(BaseModel):
    email: str
    senha: str

class UsuarioResponseSchema(BaseModel):
    idUsuario: int
    nomeUsuario: str
    email: str

class UsuarioJWTSchema(BaseModel):
    id: int | None
    idUsuario: int | None = None  # Add for frontend compatibility
    email: str
    perfil: PerfilEnum
    expiration_time: datetime | None

class UsuarioPerfilUpdateSchema(BaseModel):
    perfil: PerfilEnum
