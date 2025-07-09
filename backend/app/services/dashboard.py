from app.repositories.dashboard import DashboardRepository

class DashboardService:
    @staticmethod
    def get_dashboard_data():
        return DashboardRepository.get_dashboard_data()