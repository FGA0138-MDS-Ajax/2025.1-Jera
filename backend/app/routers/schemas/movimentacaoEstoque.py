from datetime import datetime
from pydantic import BaseModel

class MovimentacaoEstoqueBase(BaseModel):
    id_produto: int
    tipo_movimentacao: str
    quantidade: int
    motivo: str

class MovimentacaoEstoqueCreate(MovimentacaoEstoqueBase):
    pass

class MovimentacaoEstoqueResponse(MovimentacaoEstoqueBase):
    id_movimentacao: int
    data_movimentacao: datetime