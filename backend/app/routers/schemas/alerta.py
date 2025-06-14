from datetime import datetime
from pydantic import BaseModel

class AlertaCreateSchema(BaseModel):
    id_produto: int
    id_tipo_alerta: int
    mensagem: str

class AlertaResponseSchema(BaseModel):
    id_alerta: int
    id_produto: int
    id_tipo_alerta: int
    data_hora_alerta: datetime
    mensagem: str
    

class AlertaUpdateSchema(BaseModel):
    id_produto: int | None = None
    id_tipo_alerta: int | None = None
    mensagem: str | None = None