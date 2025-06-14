from typing import TYPE_CHECKING, List
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.db.models.alerta import Alerta

class TipoAlerta(SQLModel, table=True):
    __tablename__ = "tipo_alerta"

    id_tipo_alerta: int | None = Field(
        primary_key=True,
        nullable=False,
        default=None, 
        sa_column_kwargs={"autoincrement": True}
        )
    
    nome_tipo_alerta: str = Field(max_length=50, nullable=False)

    alertas: list["Alerta"] = Relationship(back_populates="tipo_alerta")