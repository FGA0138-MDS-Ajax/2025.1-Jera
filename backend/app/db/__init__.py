from app.config.settings import DeployEnv, Settings
from app.db.manager import DBManager
from app.db.models import import_all_models
from app.utils.logger import Logger

config = Settings()
logger = Logger()

def initialize_database() -> None:
    """Inicializa as tabelas no banco se estiver em modo de desenvolvimento e debug."""
    if config.DEBUG and config.ENVIRONMENT == DeployEnv.DEV:
        import_all_models()
        logger.info("Running in development mode, creating all database tables.")
        DBManager.metadata_create_all()
