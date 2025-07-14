from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.db.models.usuario import PerfilEnum
from app.routers.schemas.dashboard import DashboardResponse
from app.services.dashboard import DashboardService
from app.utils.dependencies import require_profile

router = APIRouter()

@router.get("/dashboard-gerente", response_model=DashboardResponse, dependencies=[Depends(require_profile(PerfilEnum.GERENTE))])
def dashboard_gerente():
    return DashboardService.get_dashboard_data()

@router.get("/dashboard/lote-estados", dependencies=[Depends(require_profile(PerfilEnum.GERENTE))])
def estados_por_lote(lote_id: Annotated[int, Query(description="ID do lote")] = ...):
    """Retorna a contagem de itens por estado estético para um lote específico."""
    return DashboardService.get_estados_por_lote(lote_id)

