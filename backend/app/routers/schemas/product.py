from datetime import datetime

from pydantic import BaseModel


class ProductCreateSchema(BaseModel):
    nome_produto: str
    estoque_minimo: int
    estoque_maximo: int | None = None
    id_tipo_produto: int

class ProductResponseSchema(BaseModel):
    id_produto: int
    nome_produto: str
    data_cadastro_produto: datetime
    estoque_minimo: int
    estoque_maximo: int | None = None
    id_tipo_produto: int

class ProductUpdateSchema(BaseModel):
    nome_produto: str | None = None
    estoque_minimo: int | None = None
    estoque_maximo: int | None = None
    id_tipo_produto: int | None = None
