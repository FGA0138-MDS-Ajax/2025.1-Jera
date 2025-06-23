from pydantic import BaseModel, model_validator

class UsuarioCreateSchema(BaseModel):
    nomeUsuario: str
    email: str
    senha: str
    confirme_sua_senha: str

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