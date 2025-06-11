from datetime import datetime

from pydantic import BaseModel


class ProductCreateSchema(BaseModel):
    nome: str
    estoque_minimo: int
    id_tipo_produto: int
    descricao: str
    status: bool

class ProductResponseSchema(BaseModel):
    id: int
    nome: str
    data_cadastro: datetime
    estoque_minimo: int
    id_tipo_produto: int
    status: bool
    descricao: str

class ProductUpdateSchema(BaseModel):
    nome: str | None = None
    descricao: str | None = None
    estoque_minimo: int | None = None
    id_tipo_produto: int | None = None
    status: bool | None = None
