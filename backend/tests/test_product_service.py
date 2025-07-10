# tests/test_product_service.py

from unittest.mock import patch, MagicMock
from app.db.models.product import Product
from app.services.product import ProductService


@patch('app.services.product.ProductRepository')
def test_create_product_service_unit(mock_product_repo: MagicMock):
    """
    Testa o método create_product do ProductService em total isolamento.
    """
    # Arrange: Usando os nomes de campo CORRETOS do seu modelo Product
    product_data = Product(
        nome_produto="Margarida",
        estoque_minimo=10,
        id_tipo_produto=1
    )
    mock_product_repo.create_product.return_value = product_data

    # Act
    result = ProductService.create_product(product_data)

    # Assert
    mock_product_repo.create_product.assert_called_once_with(product_data)
    assert result.nome_produto == "Margarida"


@patch('app.services.product.ProductRepository')
def test_get_product_by_id_found(mock_product_repo: MagicMock):
    """
    Testa o caso onde o produto é encontrado pelo ID.
    """
    # Arrange: Usando os nomes de campo CORRETOS do seu modelo Product
    found_product = Product(
        id_produto=15,
        nome_produto="Girassol",
        estoque_minimo=5,
        id_tipo_produto=2
    )
    mock_product_repo.get_product_by_id.return_value = found_product

    # Act
    result = ProductService.get_product_by_id(15)

    # Assert
    mock_product_repo.get_product_by_id.assert_called_once_with(15)
    assert result is not None
    assert result.id_produto == 15
    assert result.nome_produto == "Girassol"


@patch('app.services.product.ProductRepository')
def test_get_product_by_id_not_found(mock_product_repo: MagicMock):
    """
    Testa o caso onde o produto NÃO é encontrado pelo ID.
    """
    # Arrange
    mock_product_repo.get_product_by_id.return_value = None

    # Act
    result = ProductService.get_product_by_id(999)

    # Assert
    mock_product_repo.get_product_by_id.assert_called_once_with(999)
    assert result is None
    
@patch('app.services.product.ProductRepository')
def test_delete_product(mock_product_repo: MagicMock):
    """
    Testa se o ProductService.delete_product chama corretamente
    o método correspondente no ProductRepository.
    """
    # ------------------- 1. Arrange (Preparação) -------------------

    # Definimos um ID de produto que queremos "deletar".
    product_id_to_delete = 42

    # Não precisamos configurar um `return_value` no mock, pois a função
    # real não retorna nada (retorna None), e esse é o comportamento padrão
    # de um mock.

    # ------------------- 2. Act (Ação) -------------------

    # Chamamos o método do serviço que queremos testar.
    ProductService.delete_product(product_id_to_delete)

    # ------------------- 3. Assert (Verificação) -------------------

    # A única coisa que precisamos verificar é se o método `delete_product`
    # do repositório foi chamado exatamente uma vez, e com o ID correto.
    mock_product_repo.delete_product.assert_called_once_with(product_id_to_delete)

@patch('app.services.product.ProductRepository')
def test_get_all_products(mock_product_repo: MagicMock):
    """
    Testa o caso onde uma lista de produtos é retornada com sucesso.
    """
    # ------------------- 1. Arrange (Preparação) -------------------

    # Criamos uma lista de produtos falsos que o repositório "encontrará".
    fake_product_list = [
        Product(id_produto=1, nome_produto="Rosa", estoque_minimo=20, id_tipo_produto=1),
        Product(id_produto=2, nome_produto="Cravo", estoque_minimo=15, id_tipo_produto=1),
    ]

    # Configuramos o mock para retornar nossa lista falsa.
    mock_product_repo.get_all_products.return_value = fake_product_list

    # ------------------- 2. Act (Ação) -------------------

    # Chamamos o método do serviço.
    result = ProductService.get_all_products()

    # ------------------- 3. Assert (Verificação) -------------------

    # Verificamos se o método do repositório foi chamado.
    mock_product_repo.get_all_products.assert_called_once()

    # Verificamos se o resultado não é nulo e tem o tamanho correto.
    assert result is not None
    assert len(result) == 2
    
    # Verificamos se o conteúdo corresponde ao que esperamos.
    assert result[0].nome_produto == "Rosa"
    assert result[1].nome_produto == "Cravo"


@patch('app.services.product.ProductRepository')
def test_get_all_products_empty(mock_product_repo: MagicMock):
    """
    Testa o caso onde a lista de produtos retornada é vazia.
    """
    # ------------------- 1. Arrange (Preparação) -------------------

    # Configuramos o mock para retornar uma lista vazia.
    mock_product_repo.get_all_products.return_value = []

    # ------------------- 2. Act (Ação) -------------------

    # Chamamos o método do serviço.
    result = ProductService.get_all_products()

    # ------------------- 3. Assert (Verificação) -------------------

    # Verificamos se o método do repositório foi chamado.
    mock_product_repo.get_all_products.assert_called_once()

    # Verificamos se o resultado é uma lista vazia.
    assert result is not None
    assert len(result) == 0
    assert result == []