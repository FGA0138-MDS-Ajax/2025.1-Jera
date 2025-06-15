from strawberry.fastapi import GraphQLRouter

from app.graphql import product, user

router = GraphQLRouter(None)

router.include_router(
    user.router, prefix="/user", tags=["user"], include_in_schema=False
)
router.include_router(
    product.router, prefix="/product", tags=["product"], include_in_schema=False
)
