from sqlalchemy.orm import Session

from app.db.models.product import Product
from app.utils.session_inject import with_session


class ProductRepository:

    @staticmethod
    @with_session
    def create_product(product_data: Product, session: Session | None = None) -> Product:
        """
        Cria um novo produto e o inseri ao banco de dados, de acordo com os dados fornecidos.

        Args:
            product_data (Product): Instância do modelo Product a ser adicionada.
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        returns:
            Product: O produto criado com ID preenchido.
        """
        session.add(product_data)
        session.flush()
        session.refresh(product_data)
        return product_data

    @staticmethod
    @with_session
    def get_product_by_id(product_id: int, session: Session | None = None) -> Product | None:
        """
        Busca um produto existente por meio de seu ID.

        Args:
            product_id (int): ID do produto a ser buscado. 
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        returns:
            Product | None: O produto encontrado por ID ou None caso não encontre.
        """
        return session.get(Product, product_id)

    @staticmethod
    @with_session
    def get_all_products(session: Session | None = None) -> list[Product]:
        """
        Recolhe todos os produtos cadastrados no banco de daods.

        Args:
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        return:
            list[Product]: Retorna uma lista de todos os produtos encontrados.
        """
        return session.query(Product).all()

    @staticmethod
    @with_session
    def update_product(product_id: int, product_data: dict[str, any], session: Session | None = None) -> Product | None:
        """
        Atualiza um produto existente com os argumentos citados.

        Args: 
            product_id (int): Id do produto escolhido para ser atualizado.
            product_data (dict): Dados a serem atualizados no produto.
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        returns:
            Product | None: O produto atualizado, ou None caso não encontrado.
        """
        existing_product: Product | None = session.get(Product, product_id)
        if existing_product:
            for key, value in product_data.items():
                setattr(existing_product, key, value)
            session.commit()
            return existing_product
        return None

    @staticmethod
    @with_session
    def delete_product(product_id: int, session: Session | None = None) -> None:
        """
        Deleta um produto existente de acordo com os dados fornecidos.

        Args:
            product_id (int): ID do produto a ser deletado.
            session (Session, opcional): Sessão do banco de dados injetados automaticamente

        returns:
            None

        """
        existing_product: Product | None = session.get(Product, product_id)
        if existing_product:
            session.delete(existing_product)
            session.commit()
