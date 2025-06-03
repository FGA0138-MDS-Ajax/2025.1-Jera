""" CRUD + lógicas específicas do MySQL"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from App.db.models.products import Produto
from App.Config.db import SessionLocal
from App.schemas.product_schema import ProdutoCreate, ProdutoResponse


def criar_produto(db: Session, produto: ProdutoCreate):
    db_produto = Produto(
        nome = produto.nome, 
        description = produto.description
        tipo_id = produto.tipo_id
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def listar_produto(db:Session):
    return db.query(Produto).all()
    
def atualizar_produto(db:Session, produto_id: int, produto: ProductCreate):
    db_produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if db_produto:
        db_produto.nome = produto.nome
        db_produto.description = produto.description
        db_produto.tipo_id = produto.tipo_id

        db.commit()
        db.refresh(db_produto)

def deletar_produto(db: Session, produto_id:int):
    db_produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if db_produto:
        db.delete(db_produto)
        db.commit()

        return db_produto