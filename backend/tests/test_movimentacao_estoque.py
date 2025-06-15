# tests/services/test_movimentacao_estoque_service.py

import os
import sys
import pytest
from unittest.mock import patch, MagicMock

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
from app.services.movimentacaoEstoque import MovimentacaoEstoqueService
from app.db.models.movimentacaoEstoque import MovimentacaoEstoque


# O decorator @patch substitui o MovimentacaoEstoqueRepository por um 'mock' (um dublê)
# durante a execução de todos os testes nesta função.
@patch('app.services.movimentacaoEstoque.MovimentacaoEstoqueRepository')
def test_registrar_entrada_deve_definir_tipo_true_e_chamar_repositorio(mock_repo):
    """
    Testa se o método registrar_entrada:
    1. Define o atributo 'tipo_movimentacao' como True.
    2. Chama o método correto do repositório.
    3. Retorna o que o repositório retornou.
    """
    # 1. Preparação (Arrange)
    mock_movimentacao = MagicMock(spec=MovimentacaoEstoque)
    valor_retorno_esperado = {"id": 1, "status": "registrado"}
    mock_repo.registrar_entrada.return_value = valor_retorno_esperado
    
    # 2. Ação (Act)
    resultado = MovimentacaoEstoqueService.registrar_entrada(mock_movimentacao)
    
    # 3. Verificação (Assert)
    assert mock_movimentacao.tipo_movimentacao is True, "O tipo_movimentacao deveria ser True para entrada"
    mock_repo.registrar_entrada.assert_called_once_with(mock_movimentacao)
    assert resultado == valor_retorno_esperado, "O serviço deve retornar o resultado do repositório"


@patch('app.services.movimentacaoEstoque.MovimentacaoEstoqueRepository')
def test_registrar_saida_deve_definir_tipo_false_e_chamar_repositorio(mock_repo):
    """
    Testa se o método registrar_saida:
    1. Define o atributo 'tipo_movimentacao' como False.
    2. Chama o método correto do repositório.
    """
    # 1. Preparação (Arrange)
    mock_movimentacao = MagicMock(spec=MovimentacaoEstoque)
    mock_repo.registrar_saida.return_value = {"id": 2, "status": "saida_registrada"}

    # 2. Ação (Act)
    resultado = MovimentacaoEstoqueService.registrar_saida(mock_movimentacao)
    
    # 3. Verificação (Assert)
    assert mock_movimentacao.tipo_movimentacao is False, "O tipo_movimentacao deveria ser False para saída"
    mock_repo.registrar_saida.assert_called_once_with(mock_movimentacao)
    assert resultado == {"id": 2, "status": "saida_registrada"}


@patch('app.services.movimentacaoEstoque.MovimentacaoEstoqueRepository')
def test_validar_movimentacao_deve_repassar_chamada_e_retorno(mock_repo):
    """
    Testa se o método validar_movimentacao simplesmente chama o repositório
    e retorna seu valor (True ou False) sem modificá-lo.
    """
    # --- Cenário 1: Repositório retorna True ---
    mock_movimentacao_valida = MagicMock(spec=MovimentacaoEstoque)
    mock_repo.validar_movimentacao.return_value = True
    resultado_valido = MovimentacaoEstoqueService.validar_movimentacao(mock_movimentacao_valida)
    mock_repo.validar_movimentacao.assert_called_with(mock_movimentacao_valida)
    assert resultado_valido is True
    
    # --- Cenário 2: Repositório retorna False ---
    mock_movimentacao_invalida = MagicMock(spec=MovimentacaoEstoque)
    mock_repo.validar_movimentacao.return_value = False
    resultado_invalido = MovimentacaoEstoqueService.validar_movimentacao(mock_movimentacao_invalida)
    mock_repo.validar_movimentacao.assert_called_with(mock_movimentacao_invalida)
    assert resultado_invalido is False
