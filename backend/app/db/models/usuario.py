from sqlalchemy import Column
from sqlmodel import SQLModel, Field
from enum import Enum
from sqlalchemy import Enum as SqlEnum

class PerfilEnum(str, Enum):
    OPERADOR = "OPERADOR"
    GERENTE = "GERENTE"
    ADMINISTRADOR = "ADMINISTRADOR"

class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"

    idUsuario: int = Field(default=None, primary_key=True, nullable=False)
    nomeUsuario: str
    email: str
    senha: str
    perfil: PerfilEnum = Field(sa_column=Column(SqlEnum(PerfilEnum), nullable=False, default=PerfilEnum.OPERADOR))