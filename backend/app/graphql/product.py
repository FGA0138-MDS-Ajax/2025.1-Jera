import strawberry
from strawberry.fastapi import GraphQLRouter

from app.graphql.user import User


@strawberry.type
class Product:
    """Produto do sistema."""

    user: User
    name: str


@strawberry.type
class ProductQuery:
    """Consultas de produtos."""

    @strawberry.field
    def product(self) -> Product:
        """Retorna um produto de exemplo."""
        return Product(user=User(name="Patrick", age=100), name="Morango")


schema = strawberry.Schema(query=ProductQuery)

router = GraphQLRouter(schema)
