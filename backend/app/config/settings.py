from enum import Enum

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.utils.singleton import singleton


class DBVendor(Enum):
    MYSQL = "MYSQL"
    POSTGRES = "POSTGRES"


class DeployEnv(Enum):
    DEV = "DEV"
    PROD = "PROD"


@singleton
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        validate_default=True, case_sensitive=True, env_ignore_empty=False
    )

    # Configs do banco de dados
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: SecretStr
    DB_NAME: str
    DB_VENDOR: DBVendor = DBVendor.MYSQL

    @property
    def DB_DRIVER(self) -> str:  # noqa: N802
        match self.DB_VENDOR:
            case DBVendor.MYSQL:
                return "mysql+pymysql"
            case DBVendor.POSTGRES:
                return "postgresql+psycopg"  # verificar a possibilidade de usar postgresql (com asyncpg e uvloop)
            case _:
                msg = f"DB_VENDOR não suportado: {self.DB_VENDOR}"
                raise ValueError(msg)

    # Configs de logging
    LOG_DIR: str
    LOG_FILE: str
    LOG_MAX_BYTES: int
    LOG_BACKUP_COUNT: int
    DISABLE_EXISTING_LOGGERS: bool

    # Configs de ambiente
    ENVIRONMENT: DeployEnv
    DEBUG: bool
    TESTING: bool
