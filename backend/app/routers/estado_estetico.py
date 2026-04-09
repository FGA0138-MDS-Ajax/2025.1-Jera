from app.utils.logger import Logger

from fastapi import APIRouter, HTTPException
from typing import List
from app.services.estado import EstadoEsteticoService
from app.routers.schemas.estado_estetico import (
    EstadoEsteticoCreateSchema,
    EstadoEsteticoResponseSchema,
    EstadoEsteticoUpdateSchema
)

logger = Logger()
router = APIRouter()


@router.post("/estado_estetico", response_model=EstadoEsteticoResponseSchema)
def criar_estado(estado: EstadoEsteticoCreateSchema):

    try:
        return EstadoEsteticoService.criar_estado(estado.nome_estado_estetico)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/estado_estetico", response_model=List[EstadoEsteticoResponseSchema])
def listar_estados():
    return EstadoEsteticoService.listar_estados()

@router.get("/estado_estetico/{id_estado}", response_model=EstadoEsteticoResponseSchema)
def get_estado(id_estado: int):
    estado = EstadoEsteticoService.get_estado_by_id(id_estado)
    if not estado:
        raise HTTPException(status_code=404, detail="Estado estético não encontrado")
    return estado

@router.put("/estado_estetico/{id_estado_estetico}", response_model=EstadoEsteticoResponseSchema)
def update_estado_estetico(id_estado_estetico: int, request_body: EstadoEsteticoUpdateSchema):
    estado = EstadoEsteticoService.update_estado_estetico(id_estado_estetico, request_body)
    if not estado:
        raise HTTPException(status_code=404, detail="Estado estético não encontrado.")
    return estado

@router.delete("/estado_estetico/{id_estado}", status_code= 204)
def del_estado(id_estado:int):
    deletar_estado = EstadoEsteticoService.deletar_estado_by_id(id_estado)
    if not deletar_estado:
        logger.error(f"Falha ao remover alerta com id {id_estado}.")
        raise HTTPException(status_code=404, detail="Alerta não encontrado para remoção.")
    logger.info(f"Alerta com id {id_estado} removido com sucesso.")
    return None