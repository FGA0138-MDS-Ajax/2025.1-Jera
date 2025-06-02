from sqlalchemy.orm import Session

from app.db.models.product_type import ProductType
from app.utils.session_inject import with_session


class ProductTypeRepository:

    @staticmethod
    @with_session
    def create_product_type(product_type_data: ProductType, session: Session | None = None) -> ProductType:
        session.add(product_type_data)
        session.flush()
        session.refresh(product_type_data)
        return product_type_data

    @staticmethod
    @with_session
    def get_product_type_by_id(product_type_id: int, session: Session | None = None) -> ProductType | None:
        return session.get(ProductType, product_type_id)

    @staticmethod
    @with_session
    def get_all_product_types(session: Session | None = None) -> list[ProductType]:
        return session.query(ProductType).all()

    @staticmethod
    @with_session
    def update_product_type(product_type_data: ProductType, session: Session | None = None) -> ProductType | None:
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
