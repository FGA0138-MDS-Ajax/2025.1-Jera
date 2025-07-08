from pydantic import BaseModel
from datetime import datetime

class MovimentacaoEstoqueBase(BaseModel):
    id_produto: int
    tipo_movimentacao: bool
    quantidade: int
    motivo: str | None = None
    id_lote: int
    id_estado_estetico: int
    id_usuario: int

class MovimentacaoEstoqueCreate(MovimentacaoEstoqueBase):
    pass

class MovimentacaoEstoqueResponse(MovimentacaoEstoqueBase):
    id_movimentacao: int
    data_movimentacao: datetime