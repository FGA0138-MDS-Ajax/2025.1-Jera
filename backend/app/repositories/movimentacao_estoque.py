from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.db.models.product import Product
from app.services.alerta import AlertaService
from app.utils.session_inject import with_session
from sqlalchemy.orm import Session

class MovimentacaoEstoqueRepository:

    @staticmethod
    @with_session
    def listar_todas(session: Session = None) -> list[MovimentacaoEstoque]:
        """
        Retorna todas as movimentações de estoque cadastradas.
        """
        return session.query(MovimentacaoEstoque).all()
    
    @staticmethod
    @with_session
    def listar_por_produto(id_produto: int, session: Session = None) -> list[MovimentacaoEstoque]:
        """
        Retorna todas as movimentações de estoque de um produto específico.
        """
        return session.query(MovimentacaoEstoque).filter(
            MovimentacaoEstoque.id_produto == id_produto
        ).all()
        
    @staticmethod
    @with_session
    def delete_movimentacoes(id_movimentacao: int, session: Session = None) -> None:
        existing_movimentacao: MovimentacaoEstoque | None = session.get(MovimentacaoEstoque, id_movimentacao)
        if existing_movimentacao:  
            session.delete(existing_movimentacao)
            session.commit()

    @staticmethod
    @with_session
    def registrar_entrada(movimentacao: MovimentacaoEstoque, session: Session = None):
        """
        Registra uma movimentação de entrada de estoque para um produto.
        """
        produto = session.get(Product, movimentacao.id_produto)
        if not produto:
            raise ValueError("Produto não encontrado")
        
        session.add(movimentacao)
        session.commit()
        session.refresh(movimentacao)

        # Calcule o estoque atual após a movimentação
        estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(produto.id_produto, session)
        AlertaService.verificar_e_gerar_alerta(produto, estoque_atual)

        return movimentacao

    @staticmethod
    @with_session
    def registrar_saida(movimentacao: MovimentacaoEstoque, session: Session = None):
        """
        Registra uma movimentação de saída de estoque para um produto.
        """
        produto = session.get(Product, movimentacao.id_produto)
        if not produto:
            raise ValueError("Produto não encontrado")
        
        # Validação de estoque suficiente
        estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(produto.id_produto, session)
        if estoque_atual < movimentacao.quantidade:
            raise ValueError("Quantidade insuficiente em estoque")
        
        session.add(movimentacao)
        session.commit()
        session.refresh(movimentacao)

        # Recalcule o estoque após a saída
        estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(produto.id_produto, session)
        AlertaService.verificar_e_gerar_alerta(produto, estoque_atual)

        return movimentacao
        
    
    @staticmethod
    @with_session
    def calcular_estoque(id_produto: int, session: Session = None) -> int:
        """
        Calcula o estoque atual de um produto com base nas movimentações de entrada e saída.
        """
        entradas = session.query(MovimentacaoEstoque).filter(
            MovimentacaoEstoque.id_produto == id_produto,
            MovimentacaoEstoque.tipo_movimentacao == True
        ).with_entities(MovimentacaoEstoque.quantidade).all()

        saidas = session.query(MovimentacaoEstoque).filter(
            MovimentacaoEstoque.id_produto == id_produto,
            MovimentacaoEstoque.tipo_movimentacao == False
        ).with_entities(MovimentacaoEstoque.quantidade).all()

        total_entradas = sum([e[0] for e in entradas])
        total_saidas = sum([s[0] for s in saidas])
        return total_entradas - total_saidas