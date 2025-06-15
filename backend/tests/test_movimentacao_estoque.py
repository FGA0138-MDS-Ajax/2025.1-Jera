# tests/services/test_movimentacao_estoque_service.py

import os
import sys
import pytest
from unittest.mock import patch, MagicMock

# --- ETAPA 0: CONFIGURAÇÃO DO PYTHON PATH ---
# Adiciona o diretório pai (backend) ao sys.path para que o Python possa encontrar o módulo 'app'.
# Esta é a correção para o erro 'ModuleNotFoundError: No module named 'app...''
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


# --- ETAPA 1: CONFIGURAÇÃO DO AMBIENTE ---
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

# --- ETAPA 2: MOCK DA CRIAÇÃO DO MOTOR DO BANCO ---
# O erro ocorre porque, ao importar o app, ele tenta criar uma conexão real.
# A melhor maneira de evitar isso é interceptar a função que cria a conexão
# (sqlalchemy.create_engine) e substituí-la por um mock ANTES de importar o app.
patcher_engine = patch('sqlalchemy.create_engine', return_value=MagicMock())
patcher_engine.start()

# --- ETAPA 3: IMPORTAÇÃO DOS MÓDULOS ---
# Agora que o ambiente e o path estão configurados e a conexão com o BD está "mockada",
# podemos importar os módulos do app com segurança.
# CORREÇÃO: Alterado de 'movimentacao_estoque' para 'movimentacaoEstoque' para corresponder ao nome real do arquivo.
from app.services.movimentacaoEstoque import MovimentacaoEstoqueService
from app.db.models.movimentacaoEstoque import MovimentacaoEstoque


# O decorator @patch substitui o MovimentacaoEstoqueRepository por um 'mock' (um dublê)
# durante a execução de todos os testes nesta função.
# CORREÇÃO: Alterado de 'movimentacao_estoque' para 'movimentacaoEstoque'
@patch('app.services.movimentacaoEstoque.MovimentacaoEstoqueRepository')
def test_registrar_entrada_deve_definir_tipo_true_e_chamar_repositorio(mock_repo):
    """
    Testa se o método registrar_entrada:
    1. Define o atributo 'tipo_movimentacao' como True.
    2. Chama o método correto do repositório.
    3. Retorna o que o repositório retornou.
    """
    # --- 1. Preparação (Arrange) ---
    
    # Criamos um objeto de movimentação 'falso' para o teste.
    # MagicMock é flexível e nos permite simular qualquer objeto.
    mock_movimentacao = MagicMock(spec=MovimentacaoEstoque)
    
    # Definimos um valor de retorno esperado para a chamada do repositório
    valor_retorno_esperado = {"id": 1, "status": "registrado"}
    mock_repo.registrar_entrada.return_value = valor_retorno_esperado
    
    # --- 2. Ação (Act) ---
    
    # Chamamos o método de serviço que estamos testando
    resultado = MovimentacaoEstoqueService.registrar_entrada(mock_movimentacao)
    
    # --- 3. Verificação (Assert) ---
    
    # Verificamos se o serviço modificou o objeto de movimentação corretamente
    assert mock_movimentacao.tipo_movimentacao is True, "O tipo_movimentacao deveria ser True para entrada"
    
    # Verificamos se o método do repositório foi chamado exatamente uma vez com o objeto correto
    mock_repo.registrar_entrada.assert_called_once_with(mock_movimentacao)
    
    # Verificamos se o resultado retornado pelo serviço é o mesmo que o repositório retornou
    assert resultado == valor_retorno_esperado, "O serviço deve retornar o resultado do repositório"


# CORREÇÃO: Alterado de 'movimentacao_estoque' para 'movimentacaoEstoque'
@patch('app.services.movimentacaoEstoque.MovimentacaoEstoqueRepository')
def test_registrar_saida_deve_definir_tipo_false_e_chamar_repositorio(mock_repo):
    """
    Testa se o método registrar_saida:
    1. Define o atributo 'tipo_movimentacao' como False.
    2. Chama o método correto do repositório.
    """
    # --- 1. Preparação (Arrange) ---
    mock_movimentacao = MagicMock(spec=MovimentacaoEstoque)
    mock_repo.registrar_saida.return_value = {"id": 2, "status": "saida_registrada"}

    # --- 2. Ação (Act) ---
    resultado = MovimentacaoEstoqueService.registrar_saida(mock_movimentacao)
    
    # --- 3. Verificação (Assert) ---
    assert mock_movimentacao.tipo_movimentacao is False, "O tipo_movimentacao deveria ser False para saída"
    mock_repo.registrar_saida.assert_called_once_with(mock_movimentacao)
    assert resultado == {"id": 2, "status": "saida_registrada"}


# CORREÇÃO: Alterado de 'movimentacao_estoque' para 'movimentacaoEstoque'
@patch('app.services.movimentacaoEstoque.MovimentacaoEstoqueRepository')
def test_validar_movimentacao_deve_repassar_chamada_e_retorno(mock_repo):
    """
    Testa se o método validar_movimentacao simplesmente chama o repositório
    e retorna seu valor (True ou False) sem modificá-lo.
    """
    # --- Cenário 1: Repositório retorna True ---
    
    # Arrange
    mock_movimentacao_valida = MagicMock(spec=MovimentacaoEstoque)
    mock_repo.validar_movimentacao.return_value = True
    
    # Act
    resultado_valido = MovimentacaoEstoqueService.validar_movimentacao(mock_movimentacao_valida)
    
    # Assert
    mock_repo.validar_movimentacao.assert_called_with(mock_movimentacao_valida)
    assert resultado_valido is True
    
    # --- Cenário 2: Repositório retorna False ---
    
    # Arrange
    mock_movimentacao_invalida = MagicMock(spec=MovimentacaoEstoque)
    mock_repo.validar_movimentacao.return_value = False
    
    # Act
    resultado_invalido = MovimentacaoEstoqueService.validar_movimentacao(mock_movimentacao_invalida)
    
    # Assert
    mock_repo.validar_movimentacao.assert_called_with(mock_movimentacao_invalida)
    assert resultado_invalido is False
