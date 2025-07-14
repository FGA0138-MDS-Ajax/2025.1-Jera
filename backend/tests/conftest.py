
# backend/tests/conftest.py

import sys
import types
import os
from dotenv import load_dotenv

# 1) Definir stub para o pacote app.db, preservando submódulos reais
conftest_dir = os.path.dirname(__file__)
backend_dir = os.path.dirname(conftest_dir)
db_dir = os.path.join(backend_dir, 'app', 'db')

app_db_pkg = types.ModuleType("app.db")
# Permite importar submódulos de app.db/models etc.
app_db_pkg.__path__ = [db_dir]
# stub das funções que seriam executadas no __init__.py real
def _noop(*args, **kwargs): pass
app_db_pkg.initialize_database = _noop
app_db_pkg.ensure_estados_esteticos = _noop
sys.modules["app.db"] = app_db_pkg

# 2) Stub do manager para não conectar
mgr_mod = types.ModuleType("app.db.manager")
class DBManagerStub:
    @classmethod
    def get_session_context(cls):
        class Ctx:
            def __enter__(self): return None
            def __exit__(self, exc_type, exc, tb): return False
        return Ctx()
mgr_mod.DBManager = DBManagerStub
sys.modules["app.db.manager"] = mgr_mod

# 3) Stubs para Strawberry GraphQL
decor_pkg = types.ModuleType("strawberry")
def _type(cls): return cls
def _field(f=None, **kw): return f if f else (lambda x: x)
decor_pkg.type = _type
decor_pkg.field = _field
decor_pkg.Schema = lambda *a, **k: None
sys.modules['strawberry'] = decor_pkg

fastapi_gql = types.ModuleType("strawberry.fastapi")
fastapi_gql.GraphQLRouter = lambda *a, **k: None
sys.modules['strawberry.fastapi'] = fastapi_gql

# Stub do router GraphQL interno
from fastapi import APIRouter
gql_router_mod = types.ModuleType("app.routers.graphql")
gql_router_mod.router = APIRouter()
sys.modules['app.routers.graphql'] = gql_router_mod

# 4) Stub para jwt
jwt_mod = types.ModuleType("jwt")
jwt_mod.decode = lambda token, key, algorithms=None: {}
jwt_mod.encode = lambda payload, key, algorithm=None: "token"
sys.modules['jwt'] = jwt_mod

# 5) Stub para passlib.context.CryptContext
passlib_mod = types.ModuleType("passlib")
context_mod = types.ModuleType("passlib.context")
class _CryptContextStub:
    def hash(self, pwd): return "hashed"
    def verify(self, pwd, hash): return True
context_mod.CryptContext = lambda *a, **k: _CryptContextStub()
sys.modules['passlib'] = passlib_mod
sys.modules['passlib.context'] = context_mod

# 6) Variáveis de ambiente para Settings
for key, val in {
    "DB_HOST":"localhost","DB_PORT":"5432","DB_USER":"test","DB_PASS":"test",
    "DB_NAME":"testdb","LOG_DIR":"./logs","LOG_FILE":"app.log","LOG_MAX_BYTES":"10485760",
    "LOG_BACKUP_COUNT":"3","DISABLE_EXISTING_LOGGERS":"False","ENVIRONMENT":"DEV",
    "DEBUG":"False","TESTING":"True"
}.items():
    os.environ.setdefault(key, val)

# 7) Carrega .env.test
load_dotenv(os.path.join(backend_dir, '.env.test'))

# 8) Imports principais após stubs e env
import pytest
from testcontainers.postgres import PostgresContainer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import api
from sqlmodel import SQLModel

# 9) Fixtures unit tests (SQLite)
@pytest.fixture(scope="function")
def mock_db_engine():
    url = "sqlite:///:memory:"
    engine = create_engine(url, connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture(scope="function")
def mock_db_session(mock_db_engine):
    SessionLocal = sessionmaker(bind=mock_db_engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

# 10) Fixtures integration tests (Postgres)
@pytest.fixture(scope="session")
def postgres_url():
    with PostgresContainer("postgres:15-alpine") as pg:
        yield pg.get_connection_url()

@pytest.fixture(scope="session")
def db_engine(postgres_url):
    engine = create_engine(postgres_url)
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture(scope="function")
def db_session(db_engine):
    SessionLocal = sessionmaker(bind=db_engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

# 11) Fixture TestClient
from app.db.manager import DBManager
from contextlib import contextmanager

@pytest.fixture(scope="function")
def client(request, mock_db_session, db_session):
    """
    TestClient que injeta o db de teste substituindo o DBManager.get_session_context.
    - Usa mock_db_session (SQLite) para unit tests
    - Usa db_session  (Postgres) para integration tests
    Determinado pelo path do teste.
    """
    # Padroniza separador de path para "/"
    path = str(request.fspath).replace("\\", "/")
    if "/backend/tests/integration/" in path:
        session = db_session
    else:
        session = mock_db_session

    # Override do DBManager.get_session_context para usar nossa session
    @contextmanager
    def _session_context(engine=None):
        yield session
    DBManager.get_session_context = classmethod(lambda cls, engine=None: _session_context())

    # Cria TestClient da FastAPI
    with TestClient(api) as c:
        yield c
    # Não é necessário limpar override do DBManager, pois fixture global
