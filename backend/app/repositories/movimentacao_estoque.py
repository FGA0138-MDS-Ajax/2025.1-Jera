from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.db.models.product import Product
from app.utils.session_inject import with_session
from sqlalchemy.orm import Session
from app.db.models.lote import Lote
from app.db.models.usuario import Usuario
from app.db.models.estado_estetico import EstadoEstetico


class MovimentacaoEstoqueRepository:

    
    @staticmethod
    @with_session
    def listar_movimentacoes(session: Session = None):
        # JOIN com Usuario e EstadoEstetico
        query = (
            session.query(MovimentacaoEstoque, Usuario, EstadoEstetico)
            .join(Usuario, MovimentacaoEstoque.id_usuario == Usuario.idUsuario)
            .join(EstadoEstetico, MovimentacaoEstoque.id_estado_estetico == EstadoEstetico.id_estado_estetico)
            .all()
        )
        result = []
        for mov, usuario, estado in query:
            result.append({
                "id_movimentacao": mov.id_movimentacao,
                "id_produto": mov.id_produto,
                "nome_produto": mov.produto.nome_produto if mov.produto else None,
                "id_lote": mov.id_lote,
                "nome_lote": mov.lote.nome_lote if mov.lote else None,
                "tipo_movimentacao": mov.tipo_movimentacao,
                "quantidade": mov.quantidade,
                "data_movimentacao": mov.data_movimentacao,
                "id_estado_estetico": mov.id_estado_estetico,
                "estado_estetico": estado.nome_estado_estetico,
                "usuario_email": usuario.email,
                "perfil": usuario.perfil, 
            })
        return result
    
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
    def listar_por_lote(id_lote: int, session: Session = None) -> list[MovimentacaoEstoque]:
        """
        Retorna todas as movimentações de estoque de um lote específico.
        """
        return session.query(MovimentacaoEstoque).filter(
            MovimentacaoEstoque.id_lote == id_lote
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

        # Atualize o estoque atual do lote após a movimentação
        estoque_lote = MovimentacaoEstoqueRepository.calcular_estoque(id_lote=movimentacao.id_lote, session=session)
        lote = session.get(Lote, movimentacao.id_lote)
        if lote:
            lote.quantidade_atual = estoque_lote
            session.commit()
            session.refresh(lote)

        from app.services.alerta import AlertaService

        # Calcule o estoque atual do produto após a movimentação
        estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(id_produto=produto.id_produto, session=session)
        AlertaService.verificar_e_gerar_alerta(produto, estoque_atual, movimentacao.id_lote)

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
        
        # Validação de estoque suficiente no lote
        estoque_lote = MovimentacaoEstoqueRepository.calcular_estoque(id_lote=movimentacao.id_lote, session=session)
        if estoque_lote < movimentacao.quantidade:
            raise ValueError("Quantidade insuficiente em estoque no lote")
        
        session.add(movimentacao)
        session.commit()
        session.refresh(movimentacao)

        # Atualize o estoque atual do lote após a movimentação
        estoque_lote = MovimentacaoEstoqueRepository.calcular_estoque(id_lote=movimentacao.id_lote, session=session)
        lote = session.get(Lote, movimentacao.id_lote)
        if lote:
            lote.quantidade_atual = estoque_lote
            session.commit()
            session.refresh(lote)

        from app.services.alerta import AlertaService

        # Calcule o estoque atual do produto após a movimentação
        estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(id_produto=produto.id_produto, session=session)
        AlertaService.verificar_e_gerar_alerta(produto, estoque_atual, movimentacao.id_lote)

        return movimentacao
        
    
    @staticmethod
    @with_session
    def calcular_estoque(id_produto: int = None, id_lote: int = None, session: Session = None) -> int:
        query = session.query(MovimentacaoEstoque)
        if id_lote is not None:
            query = query.filter(MovimentacaoEstoque.id_lote == id_lote)
        elif id_produto is not None:
            query = query.filter(MovimentacaoEstoque.id_produto == id_produto)
        else:
            raise ValueError("Informe id_produto ou id_lote")

        entradas = query.filter(MovimentacaoEstoque.tipo_movimentacao == True).with_entities(MovimentacaoEstoque.quantidade).all()
        saidas = query.filter(MovimentacaoEstoque.tipo_movimentacao == False).with_entities(MovimentacaoEstoque.quantidade).all()
        total_entradas = sum([e[0] for e in entradas])
        total_saidas = sum([s[0] for s in saidas])
        return total_entradas - total_saidas