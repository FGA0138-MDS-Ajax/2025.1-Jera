from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App.schemas.product_schema import ProdutoCreate, ProdutoResponse
from App.Services.products_service import (
    criar_produto, listar_produto, atualizar_produto, deletar_produto
)
from App.Config.db import SessionLocal

router = APIRouter()

