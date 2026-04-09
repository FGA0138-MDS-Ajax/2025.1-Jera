from app.repositories.dashboard import DashboardRepository

class DashboardService:
    @staticmethod
    def get_dashboard_data():
        return DashboardRepository.get_dashboard_data()
    
    @staticmethod
    def get_estados_por_lote(lote_id):
        return DashboardRepository.get_estados_por_lote(lote_id)