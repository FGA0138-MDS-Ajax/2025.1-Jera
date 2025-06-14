import strawberry
from strawberry.fastapi import GraphQLRouter


@strawberry.type
class User:
    """Usuário do sistema."""

    name: str
    age: int


lista = [
    User(name="Patrick", age=100),
    User(name="John", age=30),
    User(name="Jane", age=25),
    User(name="Alice", age=28),
]


@strawberry.type
class UserQuery:
    """Consultas de usuários."""

    @strawberry.field
    def users(self) -> list[User]:
        """Retorna a lista de usuários."""
        return lista

    @strawberry.field
    def user(self, name: str) -> User | None:
        """Busca um usuário pelo nome."""
        for user in lista:
            if user.name == name:
                return user
        return None


schema = strawberry.Schema(query=UserQuery)

router = GraphQLRouter(schema)
