from app.db.models.product import Product
from app.repositories.product import ProductRepository


class ProductService:
    @staticmethod
    def get_all_products() -> list[Product]:
        return ProductRepository.get_all_products()

    @staticmethod
    def create_product(product_data: Product) -> Product:
        return ProductRepository.create_product(product_data)

    @staticmethod
    def get_product_by_id(product_id: int) -> Product | None:
        return ProductRepository.get_product_by_id(product_id)

    @staticmethod
    def update_product(product_id: int, product_data: dict[str, any]) -> Product | None:
        return ProductRepository.update_product(product_id, product_data)

    @staticmethod
    def delete_product(product_id: int) -> None:
        ProductRepository.delete_product(product_id)
