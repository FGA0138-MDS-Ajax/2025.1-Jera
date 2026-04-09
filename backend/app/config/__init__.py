from app.config.logging import setup_logging
from app.db import initialize_database


def setup_config() -> None:
    setup_logging()
    initialize_database()
