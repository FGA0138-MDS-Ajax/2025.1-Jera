# tests/repositories/test_movimentacao_estoque_repository.py

import os
import sys
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime

# --- CONFIGURAÇÃO DO PATH ---
# Garante que o Python encontre os módulos do seu aplicativo.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# --- CONFIGURAÇÃO DO AMBIENTE ---
# Define variáveis de ambiente FALSAS antes de importar qualquer módulo do seu app.
os.environ['DB_HOST'] = 'test_host'
os.environ['DB_PORT'] = '1234'
os.environ['DB_USER'] = 'test_user'
os.environ['DB_PASS'] = 'test_pass'
os.environ['DB_NAME'] = 'test_db'
os.environ['LOG_DIR'] = '.'
os.environ['LOG_FILE'] = 'test.log'
os.environ['LOG_MAX_BYTES'] = '100000'
os.environ['LOG_BACKUP_COUNT'] = '5'
os.environ['DISABLE_EXISTING_LOGGERS'] = 'False'
os.environ['ENVIRONMENT'] = 'DEV' 
os.environ['DEBUG'] = 'True'
os.environ['TESTING'] = 'True'

# --- MOCK DA CONEXÃO ---
# Impede a aplicação de tentar criar uma conexão real durante a importação.
patcher_engine = patch('sqlalchemy.create_engine', return_value=MagicMock())
patcher_engine.start()

from sqlmodel import create_engine, Session, SQLModel
from app.repositories.movimentacaoEstoque import MovimentacaoEstoqueRepository
from app.db.models.movimentacaoEstoque import MovimentacaoEstoque
from app.db.models.product import Product

# --- CONFIGURAÇÃO DO BANCO DE DADOS DE TESTE ---
# Usamos um banco de dados SQLite em memória para os testes.
DATABASE_URL_TEST = "sqlite:///:memory:"
engine_test = create_engine(DATABASE_URL_TEST, echo=False)

@pytest.fixture(name="session")
def session_fixture():
    """
    Fixture do Pytest que cria um banco de dados e tabelas limpos para cada teste.
    """
    SQLModel.metadata.create_all(engine_test)
    with Session(engine_test) as session:
        yield session
    SQLModel.metadata.drop_all(engine_test)


# --- TESTES DO REPOSITÓRIO ---

def test_registrar_entrada_com_sucesso(session: Session):
    """
    Testa se a entrada de um produto existente é registrada corretamente.
    """
    # 1. Preparação (Arrange)
    produto_teste = Product(nome="Rosa Vermelha", estoque_minimo=10, status=True, id_tipo_produto=1)
    session.add(produto_teste)
    session.commit()
    session.refresh(produto_teste)

    movimentacao_entrada = MovimentacaoEstoque(
        id_produto=produto_teste.id,
        quantidade=50,
        data_movimentacao=datetime.now(),
        tipo_movimentacao=True,
        motivo="Entrada de teste"
    )

    # 2. Ação (Act)
    with patch('app.db.manager.DBManager.get_session_context') as mock_get_session:
        mock_get_session.return_value.__enter__.return_value = session
        resultado = MovimentacaoEstoqueRepository.registrar_entrada(movimentacao_entrada)

    # 3. Verificação (Assert)
    assert resultado.id_movimentacao is not None
    assert resultado.id_produto == produto_teste.id
    assert resultado.quantidade == 50
    assert resultado.motivo == "Entrada de teste"
    movimentacao_no_banco = session.get(MovimentacaoEstoque, resultado.id_movimentacao)
    assert movimentacao_no_banco is not None


def test_registrar_entrada_de_produto_inexistente_lanca_erro(session: Session):
    """
    Testa se o sistema lança um ValueError ao tentar dar entrada em um produto que não existe.
    """
    # 1. Arrange
    movimentacao_invalida = MovimentacaoEstoque(
        id_produto=999,
        quantidade=10,
        data_movimentacao=datetime.now(),
        tipo_movimentacao=True,
        motivo="Teste de produto inexistente"
    )

    # 2. Act & 3. Assert
    with patch('app.db.manager.DBManager.get_session_context') as mock_get_session:
        mock_get_session.return_value.__enter__.return_value = session
        with pytest.raises(ValueError, match="Produto não encontrado"):
            MovimentacaoEstoqueRepository.registrar_entrada(movimentacao_invalida)


def test_registrar_saida_com_estoque_suficiente(session: Session):
    """
    Testa se a saída de um produto com estoque suficiente é registrada.
    """
    # 1. Arrange
    produto_teste = Product(nome="Orquídea", estoque_minimo=10, status=True, id_tipo_produto=1)
    session.add(produto_teste)
    session.commit()
    session.refresh(produto_teste)

    movimentacao_saida = MovimentacaoEstoque(
        id_produto=produto_teste.id,
        quantidade=5,
        data_movimentacao=datetime.now(),
        tipo_movimentacao=False,
        motivo="Saída de teste"
    )

    # 2. Act
    with patch('app.db.manager.DBManager.get_session_context') as mock_get_session:
        mock_get_session.return_value.__enter__.return_value = session
        resultado = MovimentacaoEstoqueRepository.registrar_saida(movimentacao_saida)

    # 3. Assert
    assert resultado.id_movimentacao is not None
    assert resultado.quantidade == 5


def test_registrar_saida_com_estoque_insuficiente_lanca_erro(session: Session):
    """
    Testa se o sistema bloqueia a saída quando a quantidade é maior que o estoque_minimo.
    """
    # 1. Arrange
    produto_teste = Product(nome="Girassol", estoque_minimo=10, status=True, id_tipo_produto=1)
    session.add(produto_teste)
    session.commit()
    session.refresh(produto_teste) 

    movimentacao_saida = MovimentacaoEstoque(
        id_produto=produto_teste.id,
        quantidade=15,
        data_movimentacao=datetime.now(),
        tipo_movimentacao=False,
        motivo="Tentativa de saída sem estoque"
    )

    # 2. Act & 3. Assert
    with patch('app.db.manager.DBManager.get_session_context') as mock_get_session:
        mock_get_session.return_value.__enter__.return_value = session
        with pytest.raises(ValueError, match="Quantidade insuficiente em estoque"):
            MovimentacaoEstoqueRepository.registrar_saida(movimentacao_saida)


def test_validar_movimentacao():
    """
    CORREÇÃO: Este teste foi convertido para um teste de unidade para isolar a lógica
    do método `validar_movimentacao` da inconsistência do modelo Product.
    """
    # 1. Arrange
    # Cria uma sessão 'fake' (mock)
    mock_session = MagicMock(spec=Session)

    # Cria produtos 'fake' e define o atributo 'status' que o método espera.
    produto_ativo = MagicMock(spec=Product)
    produto_ativo.status = True
    
    produto_inativo = MagicMock(spec=Product)
    produto_inativo.status = False

    # Configura o mock da sessão para retornar os produtos fakes quando `get` for chamado.
    def get_side_effect(model, product_id):
        if product_id == 1:
            return produto_ativo
        if product_id == 2:
            return produto_inativo
        return None  # Retorna None para qualquer outro ID
    
    mock_session.get.side_effect = get_side_effect

    # Cria as movimentações de teste
    movimentacao_produto_ativo = MovimentacaoEstoque(id_produto=1, quantidade=1, motivo="Teste")
    movimentacao_produto_inativo = MovimentacaoEstoque(id_produto=2, quantidade=1, motivo="Teste")
    movimentacao_produto_inexistente = MovimentacaoEstoque(id_produto=999, quantidade=1, motivo="Teste")

    # 2. Act & 3. Assert
    # Chama o método do repositório com a sessão fake
    assert MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao_produto_ativo, mock_session) is True
    assert MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao_produto_inativo, mock_session) is False
    assert MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao_produto_inexistente, mock_session) is False
