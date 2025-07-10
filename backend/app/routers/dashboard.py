from fastapi import APIRouter, Query
from app.routers.schemas.dashboard import DashboardResponse
from app.services.dashboard import DashboardService

router = APIRouter()

@router.get("/dashboard-gerente", response_model=DashboardResponse)
def dashboard_gerente():
    return DashboardService.get_dashboard_data()

@router.get("/dashboard/lote-estados")
def estados_por_lote(lote_id: int = Query(..., description="ID do lote")):
    """
    Retorna a contagem de itens por estado estético para um lote específico.
    """
    return DashboardService.get_estados_por_lote(lote_id)

