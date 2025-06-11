from fastapi import APIRouter

from app.db.models.product_type import ProductType
from app.routers.schemas.product_type import (
    ProductTypeCreateSchema,
    ProductTypeResponseSchema,
)
from app.services.product_type import ProductTypeService
from app.utils.logger import Logger

logger = Logger()

router = APIRouter()


@router.get("/product_type", status_code=200)
def get_product_types() -> list[ProductTypeResponseSchema]:
    """
    Retorna todos os tipos de produto cadastrados.

    Returns:
        list[ProductTypeResponseSchema]: Lista de tipos de produto.
    """
    return ProductTypeService.get_all_product_types()

@router.post("/product_type", status_code=201)
def create_product_type(request_body: ProductTypeCreateSchema) -> ProductTypeResponseSchema:
    """
    Cria um novo tipo de produto.

    Args:
        request_body (ProductTypeCreateSchema): Dados para criação do tipo de produto.

    Returns:
        ProductTypeResponseSchema: Tipo de produto criado.
    """
    product_type = ProductType(nome=request_body.nome)
    return ProductTypeService.create_product_type(product_type).model_dump()

@router.get("/product_type/{id}", status_code=200)
def get_product_type_by_id(id: int) -> ProductTypeResponseSchema:
    """
    Busca um tipo de produto pelo seu ID.

    Args:
        id (int): ID do tipo de produto.

    Returns:
        ProductTypeResponseSchema: Tipo de produto encontrado.

    Raises:
        ValueError: Se o tipo de produto não for encontrado.
    """
    product_type = ProductTypeService.get_product_type_by_id(id)
    if not product_type:
        logger.error(f"Product type with id {id} not found.")
        raise ValueError(f"Product type with id {id} not found.")
    return product_type.model_dump()

@router.put("/product_type/{id}", status_code=200)
def update_product_type(id: int, request_body: ProductTypeCreateSchema) -> ProductTypeResponseSchema:
    """
    Atualiza um tipo de produto existente.

    Args:
        id (int): ID do tipo de produto a ser atualizado.
        request_body (ProductTypeCreateSchema): Dados para atualização.

    Returns:
        ProductTypeResponseSchema: Tipo de produto atualizado.

    Raises:
        ValueError: Se o tipo de produto não for encontrado.
    """
    product_type = ProductType(id=id, nome=request_body.nome)
    updated_product_type = ProductTypeService.update_product_type(product_type)
    if not updated_product_type:
        logger.error(f"Failed to update product type with id {id}.")
        raise ValueError(f"Failed to update product type with id {id}.")

    return updated_product_type.model_dump()
