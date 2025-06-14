from collections.abc import Generator
from contextlib import contextmanager
from typing import Self

import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.engine import URL, Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.orm.session import _SessionCloseState
from sqlmodel import SQLModel

from app.config.settings import Settings
from app.utils.logger import Logger
from app.utils.singleton import singleton

config = Settings()
logger = Logger()

ECHO_LOGS = config.DEBUG and not config.DISABLE_EXISTING_LOGGERS


@singleton
class DBManager:
    _url: URL = URL.create(
        drivername=config.DB_DRIVER,
        username=config.DB_USER,
        password=config.DB_PASS.get_secret_value(),
        host=config.DB_HOST,
        port=config.DB_PORT,
        database=config.DB_NAME,
    )
    _engine: Engine = create_engine(
        url=_url,
        pool_pre_ping=True,
        echo_pool=ECHO_LOGS,
        echo=ECHO_LOGS,
        poolclass=sqlalchemy.pool.QueuePool,
        pool_recycle=3600,
    )
    _session_factory: sessionmaker = sessionmaker(
        bind=_engine,
        expire_on_commit=False,
        class_=Session,
        close_resets_only=False,
        autocommit=False,
        autoflush=True,
    )
    BaseModel = SQLModel

    try:
        logger.debug(f"Tentando primeira conexão na url: {_url}")
        with _engine.connect() as _:
            logger.info(
                "Primeira conexão com o banco de dados estabelecida com sucesso."
            )
    except Exception as e:
        logger.exception(f"Problema ao conectar ao banco de dados. Erro: {e!s}")
        msg = "Não foi possível conectar ao banco de dados."
        raise RuntimeError(msg) from None

    @classmethod
    def test_connection(cls: Self, engine: Engine | None = None) -> None:
        if engine is None:
            engine = cls._engine
        try:
            logger.debug(f"Tentando conexão na url: {cls._url}")
            with engine.connect() as _:
                logger.debug("Conexão com o banco de dados estabelecida com sucesso.")
        except Exception as e:
            logger.exception(f"Problema ao conectar ao banco de dados. Erro: {e!s}")
            msg = "Não foi possível conectar ao banco de dados."
            raise RuntimeError(msg) from None

    @classmethod
    @contextmanager
    def get_session_context(cls: Self, engine: Engine | None = None) -> Generator[Session]:
        if engine is None:
            engine = cls._engine
            session = cls._session_factory()
        else:
            session = sessionmaker(bind=engine)()

        cls.test_connection()
        try:
            yield session

        except Exception as e:
            session.rollback()
            session.close()
            logger.exception(f"Erro ao realizar operação no banco de dados: {e!s}")
            raise RuntimeError("Ocorreu um erro durante um contexto de sessão..") from e
        finally:
            if session._close_state == _SessionCloseState.ACTIVE:  # noqa: SLF001
                session.commit()
            session.close()


    @classmethod
    def metadata_create_all(cls: Self) -> None:
        cls.test_connection()
        cls.BaseModel.metadata.create_all(bind=cls._engine)
        logger.info("Todas as tabelas foram criadas com sucesso.")
