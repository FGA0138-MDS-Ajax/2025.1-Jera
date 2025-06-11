from fastapi import APIRouter, HTTPException
from app.db.models.movimentacaoEstoque import MovimentacaoEstoque
from app.services.movimentacaoEstoque import MovimentacaoEstoqueService
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/movimentacao/entrada", response_model=MovimentacaoEstoque)
def registrar_entrada(movimentacao: MovimentacaoEstoque):
    try:
        return MovimentacaoEstoqueService.registrar_entrada(movimentacao)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/movimentacao/saida", response_model=MovimentacaoEstoque)
def registrar_saida(movimentacao: MovimentacaoEstoque):
    try:
        return MovimentacaoEstoqueService.registrar_saida(movimentacao)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))