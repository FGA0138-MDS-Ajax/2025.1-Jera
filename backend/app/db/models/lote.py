from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from app.db.models.product import Product
    from app.db.models.estado_estetico import EstadoEstetico

class Lote(SQLModel, table=True):
    __tablename__="lote"

    id_lote: int | None = Field(
        primary_key=True, 
        default=None, 
        nullable=False, 
        sa_column_kwargs={"autoincrement":True}
        )
    
    data_entrada: datetime | None = Field(default_factory=datetime.now, nullable=False)
    data_validade: datetime | None = Field(nullable=False)
    id_produto: int = Field(foreign_key="produto.id_produto", nullable=False)
    id_estado_estetico: int = Field(foreign_key="estado_estetico.id_estado_estetico", nullable=False)

    estado_estetico: "EstadoEstetico" = Relationship(back_populates="lotes")
    product: "Product" = Relationship(back_populates="lotes")

    