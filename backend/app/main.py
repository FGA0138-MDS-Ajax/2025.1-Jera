from fastapi import FastAPI

from app.routers import graphql, product, product_type, alerta, tipo_alerta, movimentacao_estoque, lote, estado_estetico, usuario
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
api.include_router(lote.router, prefix="/api", tags=["lote"])
api.include_router(estado_estetico.router, prefix="/api", tags=["estado_estetico"])
api.include_router(usuario.router, prefix="/api", tags=["usuario"])