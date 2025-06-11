from pydantic import BaseModel


class ProductTypeCreateSchema(BaseModel):
    nome: str


class ProductTypeResponseSchema(BaseModel):
    id: int
    nome: str
