from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel

class LoteBaseSchema(BaseModel):
    id_produto: int

class LoteCreateSchema(LoteBaseSchema):
    pass

class LoteUpdateSchema(BaseModel):
    data_entrada: Optional[datetime] = None
    concluido: Optional[bool] = None
class LoteResponseSchema(LoteBaseSchema):
    id_lote: int
    quantidade_atual:int
    concluido: bool
    data_entrada: datetime
    estado_predominante: Optional[str] = None
