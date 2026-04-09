from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

if TYPE_CHECKING:
    from app.db.models.product import Product
    from app.db.models.lote import Lote
    from app.db.models.estado_estetico import EstadoEstetico
    from app.db.models.usuario import Usuario

class MovimentacaoEstoque(SQLModel, table=True):
    __tablename__ = "movimentacao_estoque"

    id_movimentacao: int = Field(
        default=None,
        primary_key=True,
        nullable=False,
        sa_column_kwargs={"autoincrement": True}
    )
    id_produto: int = Field(foreign_key="produto.id_produto", nullable=False)
    tipo_movimentacao: bool
    quantidade: int
    id_estado_estetico: int = Field(foreign_key="estado_estetico.id_estado_estetico", nullable=False)
    data_movimentacao: datetime = Field(default_factory=datetime.now, nullable=False)
    motivo: Optional[str] = Field(default=None)
    id_lote: int = Field(foreign_key="lote.id_lote", nullable=False)
    id_usuario: int = Field(foreign_key="usuario.idUsuario", nullable=False)

    produto: "Product" = Relationship(back_populates="movimentacoes")
    lote: Optional["Lote"] = Relationship(back_populates="movimentacoes")
    estado_estetico: Optional["EstadoEstetico"] = Relationship(back_populates="movimentacoes")
    usuario: "Usuario" = Relationship(back_populates="movimentacoes")