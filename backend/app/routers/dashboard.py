from fastapi import APIRouter
from app.routers.schemas.dashboard import DashboardResponse
from app.services.dashboard import DashboardService

router = APIRouter()

@router.get("/dashboard-gerente", response_model=DashboardResponse)
def dashboard_gerente():
    return DashboardService.get_dashboard_data()