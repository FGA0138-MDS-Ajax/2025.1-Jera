from fastapi import APIRouter, Depends, HTTPException

from app.db.models.product_type import ProductType
from app.db.models.usuario import PerfilEnum
from app.routers.schemas.product_type import (
    ProductTypeCreateSchema,
    ProductTypeResponseSchema,
)
from app.services.product_type import ProductTypeService
from app.utils.dependencies import require_profile
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


@router.post("/product_type", status_code=201, dependencies=[Depends(require_profile(PerfilEnum.ADMINISTRADOR))])
def create_product_type(request_body: ProductTypeCreateSchema) -> ProductTypeResponseSchema:
    """
    Cria um novo tipo de produto.

    Args:
        request_body (ProductTypeCreateSchema): Dados para criação do tipo de produto.

    Returns:
        ProductTypeResponseSchema: Tipo de produto criado.

    """
    product_type = ProductType(nome_tipo_produto=request_body.nome_tipo_produto)
    return ProductTypeService.create_product_type(product_type).model_dump()


@router.get("/product_type/{product_type_id}", status_code=200)
def get_product_type_by_id(product_type_id: int) -> ProductTypeResponseSchema:
    """
    Busca um tipo de produto pelo seu ID.

    Args:
        product_type_id (int): ID do tipo de produto.

    Returns:
        ProductTypeResponseSchema: Tipo de produto encontrado.

    Raises:
        ValueError: Se o tipo de produto não for encontrado.

    """
    product_type = ProductTypeService.get_product_type_by_id(product_type_id)
    if not product_type:
        logger.error(f"Product type with id {product_type_id} not found.")
        raise ValueError(f"Product type with id {product_type_id} not found.")
    return product_type.model_dump()


@router.put(
    "/product_type/{product_type_id}",
    status_code=200,
    dependencies=[Depends(require_profile(PerfilEnum.ADMINISTRADOR))],
)
def update_product_type(
    product_type_id: int,
    request_body: ProductTypeCreateSchema,
) -> ProductTypeResponseSchema:
    """
    Atualiza um tipo de produto existente.

    Args:
        product_type_id (int): ID do tipo de produto a ser atualizado.
        request_body (ProductTypeCreateSchema): Dados para atualização.

    Returns:
        ProductTypeResponseSchema: Tipo de produto atualizado.

    Raises:
        ValueError: Se o tipo de produto não for encontrado.

    """
    product_type = ProductType(id_tipo_produto=product_type_id, nome_tipo_produto=request_body.nome_tipo_produto)
    updated_product_type = ProductTypeService.update_product_type(product_type)
    if not updated_product_type:
        logger.error(f"Failed to update product type with id {product_type_id}.")
        raise ValueError(f"Failed to update product type with id {product_type_id}.")

    return updated_product_type.model_dump()


@router.delete(
    "/product_type/{product_type_id}",
    status_code=204,
    dependencies=[Depends(require_profile(PerfilEnum.ADMINISTRADOR))],
)
def delete_tipo_produto(product_type_id: int):
    sucesso = ProductTypeService.delete_product_type(product_type_id)
    if not sucesso:
        logger.error(f"Failed to delete product type with id {product_type_id}.")
        raise HTTPException(
            status_code=400,
            detail="Não foi possível remover o tipo de produto. Ele pode estar sendo usado por algum produto.",
        )
