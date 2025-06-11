from fastapi import FastAPI

from app.routers import graphql, product, product_type, movimentacaoEstoque
from app.utils.logger import Logger

logger = Logger()

api = FastAPI()
logger.info("Aplicação FastAPI inicializada.")

api.include_router(graphql.router, prefix="/graphql", tags=["graphql"])
api.include_router(product_type.router, prefix="/api", tags=["product_type"])
api.include_router(product.router, prefix="/api", tags=["product"])
api.include_router(movimentacaoEstoque.router, prefix="/api", tags=["movimentacao_estoque"])
