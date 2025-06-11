from app.db.models.movimentacaoEstoque import MovimentacaoEstoque
from app.repositories.movimentacaoEstoque import MovimentacaoEstoqueRepository

class MovimentacaoEstoqueService:
    @staticmethod
    def registrar_entrada(movimentacao: MovimentacaoEstoque):
        movimentacao.tipo_movimentacao = True
        return MovimentacaoEstoqueRepository.registrar_entrada(movimentacao)

    @staticmethod
    def registrar_saida(movimentacao: MovimentacaoEstoque):
        movimentacao.tipo_movimentacao = False
        return MovimentacaoEstoqueRepository.registrar_saida(movimentacao)
    
    @staticmethod
    def validar_movimentacao(movimentacao: MovimentacaoEstoque) -> bool:
        return MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao)