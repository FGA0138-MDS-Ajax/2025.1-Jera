from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel
from app.db.models.product_type import ProductType

if TYPE_CHECKING:
    from app.db.models.movimentacaoEstoque import MovimentacaoEstoque

class Product(SQLModel, table=True):
    __tablename__ = "produto"

    id: int | None = Field(
        default=None,
        primary_key=True,
        nullable=False,
        sa_column_kwargs={"autoincrement": True},
    )
    nome: str
    data_cadastro: datetime | None = Field(default_factory=datetime.now, nullable=False)
    estoque_minimo: int
    id_tipo_produto: int = Field(foreign_key="tipo_produto.id", nullable=False)
    
    tipo_produto: ProductType = Relationship(back_populates="produtos")
    movimentacoes: List["MovimentacaoEstoque"] = Relationship(back_populates="produto")