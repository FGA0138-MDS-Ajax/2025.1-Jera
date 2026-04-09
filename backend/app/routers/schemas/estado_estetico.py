from pydantic import BaseModel


class EstadoEsteticoCreateSchema(BaseModel):
    nome_estado_estetico: str

class EstadoEsteticoResponseSchema(BaseModel):
    id_estado_estetico: int
    nome_estado_estetico: str


class EstadoEsteticoUpdateSchema(BaseModel):
    id_estado_estetico: int | None = None
    nome_estado_estetico: str | None = None