from fastapi import APIRouter, HTTPException

from app.routers.schemas.tipo_alerta import (
    TipoAlertaCreateSchema, 
    TipoAlertaResponseSchema,
    TipoAlertaUpdateSchema 
)
from app.services.tipo_alerta import TipoAlertaService
from app.db.models.tipo_alerta import TipoAlerta
from app.utils.logger import Logger

logger = Logger()

router = APIRouter()

@router.get("/alert_type", status_code=200)
def get_alert_type() -> list[TipoAlertaResponseSchema]:
    return TipoAlertaService.get_all_tipo_alertas()

@router.post("/alert_type", status_code=201)
def create_alert_type(request_body: TipoAlertaCreateSchema) -> TipoAlertaResponseSchema:
    alert_type = TipoAlerta(nome_tipo_alerta=request_body.nome_tipo_alerta)
    return TipoAlertaService.create_tipo_alerta(alert_type).model_dump()

@router.get("/alert_type/{alert_id}", status_code=200)
def get_alert_type_by_id(alert_id: int) -> TipoAlertaResponseSchema:
    alert_type = TipoAlertaService.get_tipo_alerta_by_id(alert_id)
    if not alert_type:
        logger.error(f"Alert type with id {alert_id} not found.")
        raise HTTPException(status_code=404, detail=f"Alert type with id {alert_id} not found.")
    return alert_type.model_dump()

@router.put("/alert_type/{alert_id}", status_code=200)
def update_alert_type(alert_id: int, request_body: TipoAlertaUpdateSchema) -> TipoAlertaResponseSchema:
    tipo_alerta_data = TipoAlerta(id_tipo_alerta=alert_id, **request_body.model_dump(exclude_unset=True))
    up_alert_type = TipoAlertaService.update_tipo_alerta(tipo_alerta_data)

    if not up_alert_type:
        logger.error(f"Failed to update alert type with id {alert_id}.")
        raise HTTPException(status_code=404, detail=f"Failed to update alert type with id {alert_id}.")
    return up_alert_type

@router.delete("/alert_type/{alert_id}", status_code=204)
def deletar_alert_type(alert_id: int) -> None:
    TipoAlertaService.delete_alert_type(alert_id)
    logger.info(f"Alert type with id {alert_id} deleted successfully.")
    return {"message": "Alert type deleted successfully."}