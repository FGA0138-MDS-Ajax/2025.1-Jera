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
    def calcular_estoque(id_produto: int) -> int:
        return MovimentacaoEstoqueRepository.calcular_estoque(id_produto)
    
    @staticmethod
    def listar_todas() -> list[MovimentacaoEstoque]:
        """
        Retorna todas as movimentações de estoque cadastradas.
        """
        return MovimentacaoEstoqueRepository.listar_todas()
    
    @staticmethod
    def listar_por_produto(id_produto: int) -> list[MovimentacaoEstoque]:
        """
        Retorna todas as movimentações de estoque de um produto específico.
        """
        return MovimentacaoEstoqueRepository.listar_por_produto(id_produto)