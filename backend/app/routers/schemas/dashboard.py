from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class KPI(BaseModel):
    produtosCadastrados: int
    lotesAtivos: int
    lotesVencidos: int
    itensSemGiro: int
    totalEstoque: int

class TopFlor(BaseModel):
    nome: str
    total_saida: int

class EstoquePorTipoProduto(BaseModel):
    nome: str
    total: int

class ProdutoEstoque(BaseModel):
    nome: str
    total: int

class LoteProximo(BaseModel):
    id: int
    flor: str
    diasRestantes: int
    quantidade: int

class DashboardResponse(BaseModel):
    kpi: KPI
    estadoEstetico: Dict[str, int]
    topFlores: List[TopFlor]
    lotesProximos: List[LoteProximo]
    produtosEstoque: List[ProdutoEstoque]
    estoquePorTipoProduto: List[EstoquePorTipoProduto] 
