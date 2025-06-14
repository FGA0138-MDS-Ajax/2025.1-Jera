from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.db.models.lote import Lote
    
class EstadoEstetico(SQLModel, table=True):
    __tablename__ = "estado_estetico"

    id_estado_estetico: int | None = Field(
        primary_key=True,
        default=None,
        nullable=False,
        sa_column_kwargs={"autoincrement": True}
    )
    nome_estado_estetico: str = Field(max_length=50, nullable=False)

    lotes: list["Lote"] = Relationship(back_populates="estado_estetico")