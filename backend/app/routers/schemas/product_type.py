from pydantic import BaseModel


class ProductTypeCreateSchema(BaseModel):
    nome_tipo_produto: str


class ProductTypeResponseSchema(BaseModel):
    id_tipo_produto: int
    nome_tipo_produto: str
