from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.db.models.product import Product

class MovimentacaoEstoque(SQLModel, table=True):
    __tablename__ = "movimentacao_estoque"

    id_movimentacao: int = Field(
        default=None,
        primary_key=True,
        nullable=False,
        sa_column_kwargs={"autoincrement": True}
    )
    id_produto: int = Field(foreign_key="produto.id", nullable=False)
    tipo_movimentacao: bool
    quantidade: int
    data_movimentacao: datetime = Field(default_factory=datetime.utcnow)
    motivo: str

    produto: "Product" = Relationship(back_populates="movimentacoes")