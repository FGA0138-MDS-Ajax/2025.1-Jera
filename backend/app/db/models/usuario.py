from sqlmodel import SQLModel, Field

class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"

    idUsuario: int = Field(default=None, primary_key=True, nullable=False)
    nomeUsuario: str
    email: str
    senha: str