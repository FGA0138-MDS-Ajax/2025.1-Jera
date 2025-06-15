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
# Define variáveis de ambiente FALSAS para a inicialização do app.
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

# --- IMPORTAÇÃO DOS MÓDULOS ---
from sqlmodel import Session
from app.repositories.movimentacaoEstoque import MovimentacaoEstoqueRepository
from app.db.models.movimentacaoEstoque import MovimentacaoEstoque
from app.db.models.product import Product

# --- TESTES UNITÁRIOS DO REPOSITÓRIO ---

@patch('app.db.manager.DBManager.get_session_context')
def test_registrar_entrada_com_sucesso(mock_get_session):
    """
    Testa se o método `registrar_entrada` interage corretamente com a sessão.
    """
    # 1. Preparação (Arrange)
    mock_session = MagicMock(spec=Session)
    mock_get_session.return_value.__enter__.return_value = mock_session

    produto_existente = MagicMock(spec=Product)
    mock_session.get.return_value = produto_existente

    movimentacao_entrada = MovimentacaoEstoque(id_produto=1, quantidade=50, motivo="Entrada")
    
    # 2. Ação (Act)
    resultado = MovimentacaoEstoqueRepository.registrar_entrada(movimentacao_entrada)

    # 3. Verificação (Assert)
    mock_session.get.assert_called_once_with(Product, 1)
    mock_session.add.assert_called_once_with(movimentacao_entrada)
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(movimentacao_entrada)
    assert resultado == movimentacao_entrada


@patch('app.db.manager.DBManager.get_session_context')
def test_registrar_entrada_de_produto_inexistente_lanca_erro(mock_get_session):
    """
    Testa se um ValueError é lançado se o produto não for encontrado.
    """
    # 1. Arrange
    mock_session = MagicMock(spec=Session)
    mock_get_session.return_value.__enter__.return_value = mock_session
    mock_session.get.return_value = None  # Simula produto não encontrado

    movimentacao_invalida = MovimentacaoEstoque(id_produto=999, quantidade=10, motivo="Teste")

    # 2. Ação & 3. Assert
    with pytest.raises(ValueError, match="Produto não encontrado"):
        MovimentacaoEstoqueRepository.registrar_entrada(movimentacao_invalida)
    
    mock_session.add.assert_not_called()
    mock_session.commit.assert_not_called()


@patch('app.db.manager.DBManager.get_session_context')
def test_registrar_saida_com_estoque_suficiente(mock_get_session):
    """
    Testa o registro de uma saída quando há estoque.
    """
    # 1. Arrange
    mock_session = MagicMock(spec=Session)
    mock_get_session.return_value.__enter__.return_value = mock_session

    produto_com_estoque = MagicMock(spec=Product, estoque_minimo=10)
    mock_session.get.return_value = produto_com_estoque

    movimentacao_saida = MovimentacaoEstoque(id_produto=1, quantidade=5, motivo="Saída")
    
    # 2. Ação (Act)
    MovimentacaoEstoqueRepository.registrar_saida(movimentacao_saida)

    # 3. Verificação (Assert)
    mock_session.get.assert_called_once_with(Product, 1)
    mock_session.add.assert_called_once_with(movimentacao_saida)
    mock_session.commit.assert_called_once()


@patch('app.db.manager.DBManager.get_session_context')
def test_registrar_saida_com_estoque_insuficiente_lanca_erro(mock_get_session):
    """
    Testa se um ValueError é lançado na tentativa de saída sem estoque.
    """
    # 1. Arrange
    mock_session = MagicMock(spec=Session)
    mock_get_session.return_value.__enter__.return_value = mock_session

    produto_sem_estoque = MagicMock(spec=Product, estoque_minimo=10)
    mock_session.get.return_value = produto_sem_estoque

    movimentacao_saida = MovimentacaoEstoque(id_produto=1, quantidade=15, motivo="Saída")

    # 2. Ação & 3. Assert
    with pytest.raises(ValueError, match="Quantidade insuficiente em estoque"):
        MovimentacaoEstoqueRepository.registrar_saida(movimentacao_saida)

    mock_session.add.assert_not_called()


def test_validar_movimentacao_com_mocks():
    """
    Testa a lógica de validação do método `validar_movimentacao` de forma isolada.
    """
    # 1. Arrange
    mock_session = MagicMock(spec=Session)

    produto_ativo = MagicMock(spec=Product, status=True)
    produto_inativo = MagicMock(spec=Product, status=False)

    def get_side_effect(model, product_id):
        if product_id == 1: return produto_ativo
        if product_id == 2: return produto_inativo
        return None
    
    mock_session.get.side_effect = get_side_effect

    movimentacao_produto_ativo = MovimentacaoEstoque(id_produto=1, quantidade=1, motivo="Teste")
    movimentacao_produto_inativo = MovimentacaoEstoque(id_produto=2, quantidade=1, motivo="Teste")
    movimentacao_produto_inexistente = MovimentacaoEstoque(id_produto=999, quantidade=1, motivo="Teste")

    # 2. Act & 3. Assert
    assert MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao_produto_ativo, mock_session) is True
    assert MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao_produto_inativo, mock_session) is False
    assert MovimentacaoEstoqueRepository.validar_movimentacao(movimentacao_produto_inexistente, mock_session) is False
