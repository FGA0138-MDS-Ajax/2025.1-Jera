from app.db.models.product_type import ProductType
from app.repositories.product_type import ProductTypeRepository


class ProductTypeService:
    @staticmethod
    def get_all_product_types() -> list[ProductType]:
        return ProductTypeRepository.get_all_product_types()

    @staticmethod
    def create_product_type(product_type_data: ProductType) -> ProductType:
        return ProductTypeRepository.create_product_type(product_type_data)

    @staticmethod
    def get_product_type_by_id(product_type_id: int) -> ProductType | None:
        return ProductTypeRepository.get_product_type_by_id(product_type_id)

    @staticmethod
    def update_product_type(product_type_data: ProductType) -> ProductType | None:
        return ProductTypeRepository.update_product_type(product_type_data)

    @staticmethod
    def delete_product_type(product_type: ProductType) -> None:
        ProductTypeRepository.delete_product_type(product_type)

