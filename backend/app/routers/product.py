from fastapi import APIRouter

from app.routers.schemas.product import (
    ProductResponseSchema,
    ProductCreateSchema,
    ProductUpdateSchema,
)
from app.services.product import ProductService
from app.db.models.product import Product
from app.utils.logger import Logger

logger = Logger()

router = APIRouter()


@router.get("/product", status_code=200, response_model=list[ProductResponseSchema])
def get_products():
    return ProductService.get_all_products()


@router.post("/product", status_code=201)
def create_product(request_body: ProductCreateSchema) -> ProductResponseSchema:
    product = Product(
        nome=request_body.nome,
        descricao=request_body.descricao,
        estoque_minimo=request_body.estoque_minimo,
        id_tipo_produto=request_body.id_tipo_produto,
        status=request_body.status
    )
    return ProductService.create_product(product).model_dump()


@router.get("/product/{product_id}", status_code=200)
def get_product_by_id(product_id: int) -> ProductResponseSchema:
    product = ProductService.get_product_by_id(product_id)
    if not product:
        logger.error(f"Product type with id {product_id} not found.")
        raise ValueError(f"Product type with id {product_id} not found.")
    return product.model_dump()


@router.put("/product/{product_id}", status_code=200)
def update_product(
    product_id: int, request_body: ProductUpdateSchema
) -> ProductResponseSchema:
    updated_product = ProductService.update_product(
        product_id, request_body.model_dump(exclude_unset=True)
    )
    if not updated_product:
        logger.error(f"Failed to update product type with id {product_id}.")
        raise ValueError(f"Failed to update product type with id {product_id}.")

    return updated_product.model_dump()


@router.delete("/product/{product_id}", status_code=204)
def delete_product(product_id: int) -> None:
    ProductService.delete_product(product_id)
    logger.info(f"Product with id {product_id} deleted successfully.")
    return {"message": "Product deleted successfully."}
