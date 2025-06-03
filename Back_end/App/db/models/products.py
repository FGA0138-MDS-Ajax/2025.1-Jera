from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from App.Config.db import Base

class TipoProduto(Base):
    __tablename__ = "TipoProduto"
    id = Column(Integer, primary_key=True, index = True)
    nome = Column(String(100), nullable=False)

class Produto(Base):
    __tablename__ = "Produto"
    id = Column(Integer, primary_key=True, index = True)
    nome = Column(String(100), nullable=False)
    description = Column(String(255))
    tipo_id = Column(Integer, ForeignKey("TipoProduto.id"))

    tipo = relationship("TipoProduto")