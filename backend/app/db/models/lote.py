"""
idLote(int)
dataEntrada(datetime)
dataValidade(date)
idProduto(int)
idEstadoEstetico(int)
"""

from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from app.db.models.estado_estetico import EstadoEstetico
    from app.db.models.alerta import Alerta
    from app.db.models.product import Product
    from app.db.models.movimentacao_estoque import MovimentacaoEstoque


class Lote(SQLModel, table=True):
    __tablename__ = "lote"

    id_lote: int | None = Field(
        primary_key=True,
        nullable=False,
        default=None,
        sa_column_kwargs={"autoincrement": True}
    )

    quantidade_inicial: int = Field(nullable=False)
    quantidade_atual: int = Field(nullable=False)

    data_entrada: datetime | None = Field(default_factory=datetime.now, nullable=False)
    id_produto: int = Field(foreign_key="produto.id_produto", nullable=False)
    
    concluido: bool = Field(default=False, nullable=False)

    alertas: list["Alerta"] = Relationship(back_populates="lote")
    produto: Optional["Product"] = Relationship(back_populates="lotes")
    movimentacoes: list["MovimentacaoEstoque"] = Relationship(back_populates="lote")