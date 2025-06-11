from sqlalchemy.orm import Session

from app.db.models.product_type import ProductType
from app.utils.session_inject import with_session


class ProductTypeRepository:

    @staticmethod
    @with_session
    def create_product_type(product_type_data: ProductType, session: Session | None = None) -> ProductType:
        """
        Cria um novo tipo de produto no banco de dados.

        Args:
            product_type_data (ProductType): Instância do modelo ProductType a ser adicionada.
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        Returns:
            ProductType: O tipo de produto criado com ID preenchido.
        """
        session.add(product_type_data)
        session.flush()
        session.refresh(product_type_data)
        return product_type_data

    @staticmethod
    @with_session
    def get_product_type_by_id(product_type_id: int, session: Session | None = None) -> ProductType | None:
        """
        Busca um tipo de produto pelo seu ID.

        Args:
            product_type_id (int): ID do tipo de produto a ser buscado.
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        Returns:
            ProductType | None: O tipo de produto encontrado ou None se não existir.
        """
        return session.get(ProductType, product_type_id)

    @staticmethod
    @with_session
    def get_all_product_types(session: Session | None = None) -> list[ProductType]:
        """
        Recupera todos os tipos de produto cadastrados no banco de dados.

        Args:
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        Returns:
            list[ProductType]: Lista de todos os tipos de produto encontrados.
        """
        return session.query(ProductType).all()

    @staticmethod
    @with_session
    def update_product_type(product_type_data: ProductType, session: Session | None = None) -> ProductType | None:
        """
        Atualiza um tipo de produto existente com os dados fornecidos.

        Args:
            product_type_data (ProductType): Instância do modelo ProductType com os dados atualizados.
            session (Session, opcional): Sessão do banco de dados injetada automaticamente.

        Returns:
            ProductType | None: O tipo de produto atualizado, ou None caso não encontrado.
        """
        existing_product_type: ProductType | None = session.get(ProductType, product_type_data.id)
        if existing_product_type:
            for key, value in product_type_data.model_dump(exclude_unset=True).items():
                setattr(existing_product_type, key, value)
            session.add(existing_product_type)
            return existing_product_type
        return None

    @staticmethod
    @with_session
    def delete_product_type(product_type: ProductType, session: Session | None = None) -> None:
        
        existing_product_type: ProductType | None = session.get(ProductType, product_type.id)
        if existing_product_type:
            session.delete(existing_product_type)
            session.commit()
