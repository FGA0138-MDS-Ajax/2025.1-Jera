from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.db.models.movimentacao_estoque import MovimentacaoEstoque

class EstadoEstetico(SQLModel, table=True):
    __tablename__ = "estado_estetico"

    id_estado_estetico: int | None = Field(
        primary_key=True, 
        nullable=False, 
        default=None, 
        sa_column_kwargs={"autoincrement": True}
        )
    
    nome_estado_estetico: str = Field(max_length=50, nullable=False)

    movimentacoes: list["MovimentacaoEstoque"] = Relationship(back_populates="estado_estetico")