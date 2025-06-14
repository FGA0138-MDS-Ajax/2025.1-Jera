from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.repositories.movimentacao_estoque import MovimentacaoEstoqueRepository

class MovimentacaoEstoqueService:
    @staticmethod
    def registrar_entrada(movimentacao: MovimentacaoEstoque):
        """
        Registra uma entrada de estoque, delegando ao repositório.
        """
        movimentacao.tipo_movimentacao = True
        return MovimentacaoEstoqueRepository.registrar_entrada(movimentacao)

    @staticmethod
    def registrar_saida(movimentacao: MovimentacaoEstoque):
        """
        Registra uma saída de estoque, delegando ao repositório.
        """
        movimentacao.tipo_movimentacao = False
        return MovimentacaoEstoqueRepository.registrar_saida(movimentacao)
    
    @staticmethod
    def calcular_estoque(id_produto: int, session) -> int:
        return MovimentacaoEstoqueRepository.calcular_estoque(id_produto, session)