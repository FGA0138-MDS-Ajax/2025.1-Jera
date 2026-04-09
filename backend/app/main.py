from fastapi import Depends, FastAPI

from app.db.models.usuario import PerfilEnum
from app.routers import (
    alerta,
    dashboard,
    estado_estetico,
    lote,
    movimentacao_estoque,
    product,
    product_type,
    tipo_alerta,
    usuario,
)
from app.utils.dependencies import require_profile
from app.utils.logger import Logger

logger = Logger()

api = FastAPI()
logger.info("Aplicação FastAPI inicializada.")


@api.get("/health")
def health():
    return {"status": "healthy"}


api.include_router(
    product_type.router,
    prefix="/api",
    tags=["product_type"],
    dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))],
)
api.include_router(
    product.router, prefix="/api", tags=["product"], dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))]
)
api.include_router(
    alerta.router, prefix="/api", tags=["alerta"], dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))]
)
api.include_router(
    tipo_alerta.router,
    prefix="/api",
    tags=["tipo_alerta"],
    dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))],
)
api.include_router(
    movimentacao_estoque.router,
    prefix="/api",
    tags=["movimentacao_estoque"],
    dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))],
)
api.include_router(
    lote.router, prefix="/api", tags=["lote"], dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))]
)
api.include_router(
    estado_estetico.router,
    prefix="/api",
    tags=["estado_estetico"],
    dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))],
)
api.include_router(usuario.router, prefix="/api", tags=["usuario"])
api.include_router(
    dashboard.router, prefix="/api", tags=["dashboard"], dependencies=[Depends(require_profile(PerfilEnum.OPERADOR))]
)
