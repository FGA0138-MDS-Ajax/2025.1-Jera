from sqlalchemy import func
from datetime import datetime, timedelta
from app.db.models.product import Product
from app.db.models.lote import Lote
from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from app.db.models.product_type import ProductType
from app.utils.session_inject import with_session
from app.repositories.movimentacao_estoque import MovimentacaoEstoqueRepository
from app.repositories.estatistics_moda import calcular_moda_estado_estetico

# Dicionário fixo para mapear id_estado_estetico para nome
ESTADOS_FIXOS = {
    1: "Ruim",
    2: "Regular",
    3: "Bom"
}

class DashboardRepository:
    @staticmethod
    @with_session
    def get_dashboard_data(session=None):
        produtos_cadastrados = session.query(func.count(Product.id_produto)).scalar()
        lotes_ativos = session.query(func.count(Lote.id_lote)).filter(Lote.concluido == False).scalar()
        lotes_vencidos = session.query(func.count(Lote.id_lote)).filter(Lote.data_entrada < datetime.now() - timedelta(days=30)).scalar()
        total_estoque = session.query(func.coalesce(func.sum(Lote.quantidade_atual), 0)).scalar()

        dias_sem_giro = 15
        data_limite = datetime.now() - timedelta(days=dias_sem_giro)
        subq = session.query(MovimentacaoEstoque.id_produto).filter(MovimentacaoEstoque.data_movimentacao >= data_limite).distinct()
        itens_sem_giro = session.query(Product).filter(~Product.id_produto.in_(subq)).count()

        # Calcula o estado predominante de cada lote
        lotes = session.query(Lote).all()
        estados_predominantes = {}
        for lote in lotes:
            movimentacoes = MovimentacaoEstoqueRepository.listar_por_lote(lote.id_lote, session=session)
            id_moda = calcular_moda_estado_estetico(movimentacoes)
            if id_moda:
                estados_predominantes[id_moda] = estados_predominantes.get(id_moda, 0) + 1

        estado_estetico = {ESTADOS_FIXOS.get(id_estado, str(id_estado)): qtd for id_estado, qtd in estados_predominantes.items()}

        # Top 5 flores (saídas no mês atual)
        inicio_mes = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        top_flores = session.query(
            Product.nome_produto,
            func.sum(MovimentacaoEstoque.quantidade).label("total_saida")
        ).join(MovimentacaoEstoque, MovimentacaoEstoque.id_produto == Product.id_produto)\
         .filter(
            MovimentacaoEstoque.tipo_movimentacao == False,
            MovimentacaoEstoque.data_movimentacao >= inicio_mes
         )\
         .group_by(Product.id_produto)\
         .order_by(func.sum(MovimentacaoEstoque.quantidade).desc())\
         .limit(5).all()
        top_flores = [{"nome": nome, "total_saida": int(total or 0)} for nome, total in top_flores]

        # Produtos em estoque
        produtos_estoque = session.query(
            Product.nome_produto,
            func.coalesce(func.sum(Lote.quantidade_atual), 0)
        ).join(Lote, Lote.id_produto == Product.id_produto)\
         .group_by(Product.id_produto).all()
        produtos_estoque = [{"nome": nome, "total": int(total or 0)} for nome, total in produtos_estoque]

        # Estoque por tipo de produto
        estoque_por_tipo = session.query(
            ProductType.nome_tipo_produto,
            func.coalesce(func.sum(Lote.quantidade_atual), 0)
        ).join(Product, Product.id_tipo_produto == ProductType.id_tipo_produto)\
         .join(Lote, Lote.id_produto == Product.id_produto)\
         .group_by(ProductType.id_tipo_produto).all()
        estoque_por_tipo_produto = [{"nome": nome, "total": int(total or 0)} for nome, total in estoque_por_tipo]

        # Lotes próximos da validade
        proximos = session.query(
            Lote.id_lote, Product.nome_produto, Lote.data_entrada, Lote.quantidade_atual
        ).join(Product, Product.id_produto == Lote.id_produto)\
         .filter(Lote.data_entrada >= datetime.now() - timedelta(days=7), Lote.concluido == False)\
         .all()
        lotes_proximos = [
            {
                "id": id_lote,
                "flor": nome_produto,
                "diasRestantes": (data_entrada + timedelta(days=7) - datetime.now()).days,
                "quantidade": quantidade_atual
            }
            for id_lote, nome_produto, data_entrada, quantidade_atual in proximos
        ]

        return {
            "kpi": {
                "produtosCadastrados": produtos_cadastrados,
                "lotesAtivos": lotes_ativos,
                "lotesVencidos": lotes_vencidos,
                "itensSemGiro": itens_sem_giro,
                "totalEstoque": total_estoque
            },
            "estadoEstetico": estado_estetico,
            "topFlores": top_flores,
            "lotesProximos": lotes_proximos,
            "produtosEstoque": produtos_estoque,
            "estoquePorTipoProduto": estoque_por_tipo_produto
        }
    
    @staticmethod
    @with_session
    def get_estados_por_lote(lote_id, session=None):
        """
        Retorna a soma das quantidades movimentadas por estado estético para um lote específico.
        """
        resultados = session.query(
            MovimentacaoEstoque.id_estado_estetico,
            func.sum(MovimentacaoEstoque.quantidade)
        ).filter(
            MovimentacaoEstoque.id_lote == lote_id
        ).group_by(MovimentacaoEstoque.id_estado_estetico).all()

        # Garante que todos os estados apareçam, mesmo que zero
        contagem = {nome: 0 for nome in ESTADOS_FIXOS.values()}
        for id_estado, total in resultados:
            nome = ESTADOS_FIXOS.get(id_estado, str(id_estado))
            contagem[nome] = int(total or 0)
        return contagem
