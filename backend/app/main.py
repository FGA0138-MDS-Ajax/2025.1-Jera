from fastapi import FastAPI

from app.routers import graphql, product, product_type, alerta, tipo_alerta, movimentacao_estoque
from app.utils.logger import Logger

logger = Logger()

api = FastAPI()
logger.info("Aplicação FastAPI inicializada.")

api.include_router(graphql.router, prefix="/graphql", tags=["graphql"])
api.include_router(product_type.router, prefix="/api", tags=["product_type"])
api.include_router(product.router, prefix="/api", tags=["product"])
api.include_router(alerta.router, prefix="/api", tags=["alerta"])
api.include_router(tipo_alerta.router, prefix="/api", tags=["tipo_alerta"])
api.include_router(movimentacao_estoque.router, prefix="/api", tags=["movimentacao_estoque"])
