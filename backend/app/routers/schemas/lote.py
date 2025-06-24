from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel

class LoteBaseSchema(BaseModel):
    id_produto: int
    id_estado_estetico: int

class LoteCreateSchema(LoteBaseSchema):
    pass

class LoteUpdateSchema(BaseModel):
    data_entrada: Optional[datetime] = None
    id_produto: Optional[int] = None
    id_estado_estetico: Optional[int] = None

class LoteResponseSchema(LoteBaseSchema):
    id_lote: int
    quantidade_atual:int
    concluido: bool
    data_entrada: datetime
