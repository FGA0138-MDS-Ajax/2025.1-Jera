from pydantic import BaseModel

class TipoAlertaCreateSchema(BaseModel):
    nome_tipo_alerta: str

class TipoAlertaResponseSchema(BaseModel):
    id_tipo_alerta: int
    nome_tipo_alerta: str

    class Config:
        orm_mode = True

class TipoAlertaUpdateSchema(BaseModel):
    nome_tipo_alerta: str | None = None