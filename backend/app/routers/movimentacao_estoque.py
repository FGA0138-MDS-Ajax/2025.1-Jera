from fastapi import APIRouter, HTTPException
from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.services.movimentacao_estoque import MovimentacaoEstoqueService
from app.utils.logger import Logger

logger = Logger()
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
    
@router.get("/movimentacao/estoque_atual/{id_produto}")
def estoque_atual(id_produto: int):
    """
    Consulta o estoque atual de um produto.
    """
    return {"id_produto": id_produto, "estoque_atual": MovimentacaoEstoqueService.calcular_estoque(id_produto)}

@router.delete("/movimentacao/{id_movimentacao}", status_code=204)
def deletar_movimentacao(id_movimentacao: int):
    """
    Deleta uma movimentação de estoque pelo ID.
    """
    try:
        MovimentacaoEstoqueService.deletar(id_movimentacao)
        return {"detail": "Movimentação deletada com sucesso"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    

@router.get("/movimentacao", status_code=200)
def listar_movimentacoes():
    
    logger.info("Listando todas as movimentações de estoque")
    resultado = MovimentacaoEstoqueService.listar_todas()
    logger.info(f"{len(resultado)} movimentações encontradas")
    return resultado

@router.get("/movimentacao/produto/{id_produto}", status_code=200)
def listar_movimentacoes_por_produto(id_produto: int):

    logger.info(f"Listando movimentações do produto {id_produto}")
    resultado = MovimentacaoEstoqueService.listar_por_produto(id_produto)
    logger.info(f"{len(resultado)} movimentações encontradas para o produto {id_produto}")
    return resultado