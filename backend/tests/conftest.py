# tests/conftest.py
from dotenv import load_dotenv
load_dotenv(".env.test")
from unittest.mock import patch

# Este patch é ativado ANTES de qualquer teste ou código da aplicação ser importado.
# Ele substitui a função do SQLAlchemy que cria a conexão com o banco de dados
# por um "dublê" que não faz nada. Isso impede o erro de conexão na raiz.
patch('sqlalchemy.create_engine').start()