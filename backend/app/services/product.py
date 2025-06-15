from app.db.models.product import Product
from app.repositories.product import ProductRepository


class ProductService:
    """
    Camada de serviço responsável pela lógica de negócios relacionada a produto.
    """
    @staticmethod
    def get_all_products() -> list[Product]:
        """
        Recupera todos os produtos cadastrados.

        Returns:
            list[Product]: Lista de todos os produtos.
        """
        return ProductRepository.get_all_products()

    @staticmethod
    def create_product(product_data: Product) -> Product:
        """
        Cria um novo produto.

        Args:
            product_data (Product): Instância do modelo Product a ser criada.

        Returns:
            Product: Produto criado.
        """
        return ProductRepository.create_product(product_data)

    @staticmethod
    def get_product_by_id(product_id: int) -> Product | None:
        """
        Busca um produto pelo seu ID.

        Args:
            product_id (int): ID do produto.

        Returns:
            Product | None: Produto encontrado ou None se não existir.
        """
        return ProductRepository.get_product_by_id(product_id)

    @staticmethod
    def update_product(product_id: int, product_data: dict[str, any]) -> Product | None:
        """
        Atualiza um produto existente.

        Args:
            product_id (int): ID do produto a ser atualizado.
            product_data (dict): Dados para atualização do produto.

        Returns:
            Product | None: Produto atualizado ou None se não encontrado.
        """
        return ProductRepository.update_product(product_id, product_data)

    @staticmethod
    def delete_product(product_id: int) -> None:
        """
        Remove um produto pelo seu ID.

        Args:
            product_id (int): ID do produto a ser removido.

        Returns:
            None
        """
        ProductRepository.delete_product(product_id)
