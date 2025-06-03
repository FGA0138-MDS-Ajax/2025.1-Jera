import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from App.Config.db import Base, engine
from App.db.models.products import Produto, TipoProduto

print("Criando a tabela de Produtos (MySQL)")
Base.metadata.create_all(bind=engine)
print("Tabela criada com sucesso")