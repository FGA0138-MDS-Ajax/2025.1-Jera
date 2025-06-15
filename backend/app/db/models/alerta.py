from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.db.models.product import Product
    from app.db.models.tipo_alerta import TipoAlerta

class Alerta(SQLModel, table=True):
    __tablename__ = "alerta"

    id_alerta: int | None = Field(
        primary_key=True, 
        nullable=False, 
        default=None, 
        sa_column_kwargs={"autoincrement":True})
    
    data_hora_alerta: datetime | None = Field(default_factory=datetime.now, nullable= False)
    id_tipo_alerta: int = Field(foreign_key="tipo_alerta.id_tipo_alerta", nullable=False)
    id_produto: int      = Field(foreign_key="produto.id_produto", nullable=False)
    mensagem: str = Field(max_length=150, nullable=False)
    #id_lote: int #Criar ainda a classe Lote

    # Optional deixa explícito para o type checker e para outros desenvolvedores que esse campo não é garantido que sempre terá um valor.
    produto: Optional["Product"] = Relationship(back_populates="alertas")
    tipo_alerta: Optional["TipoAlerta"] = Relationship(back_populates="alertas")