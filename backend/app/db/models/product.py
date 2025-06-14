from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.db.models.product_type import ProductType
    from app.db.models.alerta import Alerta
    from app.db.models.movimentacao_estoque import MovimentacaoEstoque


class Product(SQLModel, table=True):
    __tablename__ = "produto"

    id_produto: int | None = Field(
        default=None,
        primary_key=True,
        nullable=False,
        sa_column_kwargs={"autoincrement": True},
    )
    nome_produto: str = Field(max_length=100, nullable=False)
    data_cadastro_produto: datetime | None = Field(default_factory=datetime.now, nullable=False)
    estoque_minimo: int
    estoque_maximo: Optional[int] = Field(default=None)
    id_tipo_produto: int = Field(
        foreign_key="tipo_produto.id_tipo_produto", nullable=False
    )
    tipo_produto: "ProductType" = Relationship(back_populates="produtos")
    alertas: list["Alerta"] = Relationship(back_populates="produto")
    movimentacoes: list["MovimentacaoEstoque"] = Relationship(back_populates="produto")
