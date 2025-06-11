from app.db.manager import DBManager
from app.db.models.movimentacaoEstoque import MovimentacaoEstoque
from app.db.models.product import Product

class MovimentacaoEstoqueRepository:
    @staticmethod
    def registrar_entrada(movimentacao: MovimentacaoEstoque):
        with DBManager.get_session_context() as session:
            produto = session.get(Product, movimentacao.id_produto)
            if not produto:
                raise ValueError("Produto não encontrado")
            
            session.add(movimentacao)
            session.commit()
            session.refresh(movimentacao)
            return movimentacao

    @staticmethod
    def registrar_saida(movimentacao: MovimentacaoEstoque):
        with DBManager.get_session_context() as session:
            produto = session.get(Product, movimentacao.id_produto)
            if not produto:
                raise ValueError("Produto não encontrado")
            
            if produto.estoque_minimo < movimentacao.quantidade:
                raise ValueError("Quantidade insuficiente em estoque")
            
            session.add(movimentacao)
            session.commit()
            session.refresh(movimentacao)
            return movimentacao
        
    @staticmethod
    def validar_movimentacao(movimentacao: MovimentacaoEstoque, session) -> bool:
        produto = session.get(Product, movimentacao.id_produto)
        if not produto or not produto.status:
            return False
        return True