from fastapi import APIRouter, HTTPException
from typing import List
from app.db.models.lote import Lote
from app.services.lote import LoteService
from app.routers.schemas.lote import (
    LoteCreateSchema,
    LoteUpdateSchema,
    LoteResponseSchema
)
from datetime import datetime
from app.services.movimentacao_estoque import MovimentacaoEstoqueService
from app.services.estado import EstadoEsteticoService
from app.repositories.estatistics_moda import calcular_moda_estado_estetico as Moda

router = APIRouter()

@router.post("/lote", response_model=LoteResponseSchema)
def criar_lote(request_body: LoteCreateSchema):
    lote = Lote(
        nome_lote=request_body.nome_lote,
        id_produto=request_body.id_produto,
        quantidade_inicial= 0,
        quantidade_atual=0,
        data_entrada=datetime.now()
    )
    return LoteService.criar_lote(lote)

@router.get("/lote", response_model=List[LoteResponseSchema])
def listar_lotes():
    return LoteService.listar_lotes()

@router.get("/lote/{id_lote}", response_model=LoteResponseSchema)
def get_lote_by_id(id_lote: int):
    lote = LoteService.listar_lotes_por_id(id_lote)
    if not lote:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    movimentacoes = MovimentacaoEstoqueService.listar_por_lote(id_lote)
    id_moda = Moda(movimentacoes)
    estado = EstadoEsteticoService.get_estado_by_id(id_moda) if id_moda else None
    return {
        "nome_lote": lote.nome_lote,
        "id_lote": lote.id_lote,
        "id_produto": lote.id_produto,
        "quantidade_atual": lote.quantidade_atual,
        "concluido": lote.concluido,
        "data_entrada": lote.data_entrada,
        "estado_predominante": estado.nome_estado_estetico if estado else None
    }

@router.put("/lote/{id_lote}", response_model=LoteResponseSchema)
def atualizar_lote(id_lote: int, dados: LoteUpdateSchema):
    lote = LoteService.atualizar_lote(id_lote, dados.model_dump(exclude_unset=True))
    if not lote:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return lote

@router.delete("/lote/{id_lote}", status_code=204)
def deletar_lote(id_lote: int):
    sucesso = LoteService.deletar_lote(id_lote)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return None

@router.get("/lote/{id_lote}/validade_estado")
def verificar_validade_e_estado(id_lote: int):
    estado, alertas = LoteService.verificar_validade_e_estado(id_lote)
    if estado is None:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return {"estado_estetico": estado, "alertas": [a.mensagem for a in alertas]}

@router.patch("/lote/{id_lote}/estado_estetico", response_model=LoteResponseSchema)
def atualizar_estado_estetico(id_lote: int, id_estado_estetico: int):
    lote = LoteService.atualizar_estado_estetico(id_lote, id_estado_estetico)
    if not lote:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return lote

@router.patch("/lote/{id_lote}/concluir", response_model=LoteResponseSchema)
def concluir_lote(id_lote: int):
    lote = LoteService.marcar_como_concluido(id_lote)
    if not lote:
        raise HTTPException(status_code=404, detail="Lote não encontrado")
    return lote

@router.get("/lote/{id_lote}/estado_predominante")
def estado_predominante_lote(id_lote: int):
    movimentacoes = MovimentacaoEstoqueService.listar_por_lote(id_lote)
    id_moda = Moda(movimentacoes)

    if  id_moda is None:
        return {"estado_predominante": None}
    estado = EstadoEsteticoService.get_estado_by_id(id_moda)
    return {"estado_predominante": estado.nome_estado_estetico}