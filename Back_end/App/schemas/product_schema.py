""" Com Pydantic, você cria classes Python que atuam como modelos de dados. 
    Dentro dessas classes, você define os campos e seus respectivos tipos (ex: int, str, bool, etc.). """

from pydantic import BaseModel
from typing import Optional

class ProdutoBase(BaseModel):
    nome: str
    description: Optional[str] = None
    tipo_id : int

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoResponse(ProdutoBase):
    id: int

    class Config:
        # Converte o objeto ORM do SQLalchemy em forma de JSON para o pydantic
        orm_mode = True