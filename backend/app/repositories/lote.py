from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models.lote import Lote
from app.db.models.product import Product
from app.db.models.alerta import Alerta
from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.utils.session_inject import with_session
from app.repositories.alerta import AlertaRepository
from app.repositories.movimentacao_estoque import MovimentacaoEstoqueRepository


class LoteRepository:

    @staticmethod
    @with_session
    def criar_lote(lote: Lote, session: Session = None) -> Lote:
        lote.quantidade_inicial = 0 
        lote.data_entrada = datetime.now()
        session.add(lote)
        session.commit()
        session.refresh(lote)
        
        produto = session.get(Product, lote.id_produto)
        if produto:
            estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(produto.id_produto)
            AlertaRepository.verificar_e_gerar_alerta(produto, estoque_atual, lote.id_lote, session=session)
        return lote


    @staticmethod
    @with_session
    def listar_lotes(session: Session = None) -> list[Lote]:
        AlertaRepository.gerar_alertas_lotes_ruins_7dias(session=session)
        return session.query(Lote).all() 
    
    @staticmethod
    @with_session
    def get_lote_by_id(id_lote: int, session: Session = None) -> Lote | None:
        return session.get(Lote, id_lote)

    @staticmethod
    @with_session
    def atualizar_lote(id_lote: int, dados: dict, session: Session = None) -> Lote | None:
        lote = session.get(Lote, id_lote)
        if not lote:
            return None
        for key, value in dados.items():
            setattr(lote, key, value)

        produto = session.get(Product, lote.id_produto)
        if not produto:
            raise ValueError("Produto informado não existe.")
        session.commit()
        session.refresh(lote)
        
        # Após atualizar, verifica alertas de estoque para o produto
        if produto:
            estoque_atual = MovimentacaoEstoqueRepository.calcular_estoque(produto.id_produto)
            AlertaRepository.verificar_e_gerar_alerta(produto, estoque_atual, lote.id_lote, session=session)
        return lote

    @staticmethod
    @with_session
    def deletar_lote(id_lote: int, session: Session = None) -> bool:
        lote_existe = session.get(Lote, id_lote)
        if not lote_existe:
            return False
        # Deletar alertas relacionados ao lote
        session.query(Alerta).filter(Alerta.id_lote == id_lote).delete()
        # Deletar movimentações relacionadas ao lote
        session.query(MovimentacaoEstoque).filter(MovimentacaoEstoque.id_lote == id_lote).delete()
        session.delete(lote_existe)
        session.commit()
        return True