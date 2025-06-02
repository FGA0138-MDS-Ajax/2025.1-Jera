from sqlalchemy.orm import Session

from app.db.models.product import Product
from app.utils.session_inject import with_session


class ProductRepository:

    @staticmethod
    @with_session
    def create_product(product_data: Product, session: Session | None = None) -> Product:
        session.add(product_data)
        session.flush()
        session.refresh(product_data)
        return product_data

    @staticmethod
    @with_session
    def get_product_by_id(product_id: int, session: Session | None = None) -> Product | None:
        return session.get(Product, product_id)

    @staticmethod
    @with_session
    def get_all_products(session: Session | None = None) -> list[Product]:
        return session.query(Product).all()

    @staticmethod
    @with_session
    def update_product(product_id: int, product_data: dict[str, any], session: Session | None = None) -> Product | None:
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
        existing_product: Product | None = session.get(Product, product_id)
        if existing_product:
            session.delete(existing_product)
            session.commit()
