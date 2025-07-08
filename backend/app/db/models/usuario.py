from sqlalchemy import Column
from sqlmodel import SQLModel, Field
from enum import Enum
from sqlalchemy import Enum as SqlEnum
from sqlmodel import Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.db.models.movimentacao_estoque import MovimentacaoEstoque
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

    movimentacoes: list["MovimentacaoEstoque"] = Relationship(back_populates="usuario")