from app.db.manager import DBManager
from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.db.models.product import Product
from app.services.alerta import AlertaService

class MovimentacaoEstoqueRepository:
    @staticmethod
    def registrar_entrada(movimentacao: MovimentacaoEstoque):
        """
        Registra uma movimentação de entrada de estoque para um produto.

        Adiciona a movimentação de entrada ao banco de dados, atualiza o estoque do produto
        e dispara a verificação automática de alertas após a movimentação.

        Args:
            movimentacao (MovimentacaoEstoque): Objeto contendo os dados da movimentação de entrada.

        Returns:
            MovimentacaoEstoque: A movimentação registrada, já persistida no banco de dados.

        Raises:
            ValueError: Se o produto informado não for encontrado no banco de dados.
        """
        with DBManager.get_session_context() as session:
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
    def registrar_saida(movimentacao: MovimentacaoEstoque):
        """
        Registra uma movimentação de saída de estoque para um produto.

        Adiciona a movimentação de saída ao banco de dados, valida se há estoque suficiente,
        atualiza o estoque do produto e dispara a verificação automática de alertas após a movimentação.

        Args:
            movimentacao (MovimentacaoEstoque): Objeto contendo os dados da movimentação de saída.

        Returns:
            MovimentacaoEstoque: A movimentação registrada, já persistida no banco de dados.

        Raises:
            ValueError: Se o produto informado não for encontrado ou se não houver estoque suficiente.
        """
        with DBManager.get_session_context() as session:
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
    def validar_movimentacao(movimentacao: MovimentacaoEstoque, session) -> bool:
        produto = session.get(Product, movimentacao.id_produto)
        if not produto or not produto.status:
            return False
        return True
    
    @staticmethod
    def calcular_estoque(id_produto: int, session) -> int:
        """
        Calcula o estoque atual de um produto com base nas movimentações de entrada e saída.

        Realiza a soma de todas as quantidades de entradas e subtrai a soma de todas as quantidades
        de saídas para o produto informado, retornando o saldo atual.

        Args:
            id_produto (int): ID do produto cujo estoque será calculado.
            session: Sessão ativa do banco de dados SQLAlchemy.

        Returns:
            int: Quantidade atual em estoque do produto.
        """
        entradas = session.query(MovimentacaoEstoque).filter(
            MovimentacaoEstoque.id_produto == id_produto,
            MovimentacaoEstoque.tipo_movimentacao == True
        ).with_entities(MovimentacaoEstoque.quantidade).all()
        #Busca das entradas pelo ID somente a quantidade

        saidas = session.query(MovimentacaoEstoque).filter(
            MovimentacaoEstoque.id_produto == id_produto,
            MovimentacaoEstoque.tipo_movimentacao == False
        ).with_entities(MovimentacaoEstoque.quantidade).all()
        #Busca das saidas pelo ID somente a quantidade

        total_entradas = sum([e[0] for e in entradas])
        total_saidas = sum([s[0] for s in saidas])
        return total_entradas - total_saidas