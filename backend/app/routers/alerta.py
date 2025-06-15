from fastapi import APIRouter, HTTPException

from app.routers.schemas.alerta import (
    AlertaCreateSchema, 
    AlertaResponseSchema, 
    AlertaUpdateSchema
)
from app.services.alerta import AlertaService
from app.db.models.alerta import Alerta
from app.utils.logger import Logger

logger = Logger()
router = APIRouter()

@router.get("/alert", status_code=200, response_model=list[AlertaResponseSchema])
def get_alerts():
    """
    Lista todos os alertas cadastrados.
    """
    return AlertaService.get_all_alerta()

@router.get("/alert/{alert_id}", status_code=200, response_model=AlertaResponseSchema)
def get_alert_by_id(alert_id: int):
    """
    Busca um alerta pelo seu ID.
    """
    alerta = AlertaService.get_alerta_by_id(alert_id)
    if not alerta:
        logger.error(f"Alerta com id {alert_id} não encontrado.")
        raise HTTPException(status_code=404, detail="Alerta não encontrado.")
    return alerta

@router.delete("/alert/delete_all", status_code=204)
def delete_all_alert():
    AlertaService.delete_all_alerta()
    logger.info(f"Alertas removidos com sucesso")
    return None

@router.delete("/alert/{alert_id}", status_code=204)
def delete_alert(alert_id: int):
    """
    Remove um alerta pelo seu ID.
    """
    del_alert = AlertaService.delete_alerta(alert_id)
    if not del_alert:
        logger.error(f"Falha ao remover alerta com id {alert_id}.")
        raise HTTPException(status_code=404, detail="Alerta não encontrado para remoção.")
    logger.info(f"Alerta com id {alert_id} removido com sucesso.")
    return None
