"""
Model para o Tipo de Produto.

Este modelo representa o tipo de produto, é usado como estrutura base para
realizar operações no banco de dados.
"""
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.db.models import Product


class ProductType(SQLModel, table=True):
    __tablename__ = "tipo_produto"

    id: int | None = Field(
        default=None,
        primary_key=True,
        nullable=False,
        sa_column_kwargs={"autoincrement": True},
    )
    nome: str = Field(max_length=100, nullable=False)
    produtos: list["Product"] = Relationship(back_populates="tipo_produto")
