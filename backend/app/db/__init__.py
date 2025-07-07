from app.config.settings import DeployEnv, Settings
from app.db.manager import DBManager
from app.db.models import import_all_models
from app.utils.logger import Logger
from app.db.models.estado_estetico import EstadoEstetico

config = Settings()
logger = Logger()
ESTADOS_FIXOS = [
    (1, "Ruim"),
    (2, "Regular"),
    (3, "Bom"),
]

def ensure_estados_esteticos():
    from app.db.manager import DBManager
    from app.db.models.estado_estetico import EstadoEstetico
    for id_estado, nome in ESTADOS_FIXOS:
        with DBManager.get_session_context() as session:
            estado = session.get(EstadoEstetico, id_estado)
            if not estado:
                session.add(EstadoEstetico(id_estado_estetico=id_estado, nome_estado_estetico=nome))
                session.commit()

def initialize_database() -> None:
    """Inicializa as tabelas no banco se estiver em modo de desenvolvimento e debug."""
    if config.DEBUG and config.ENVIRONMENT == DeployEnv.DEV:
        import_all_models()
        logger.info("Running in development mode, creating all database tables.")
        DBManager.metadata_create_all()
