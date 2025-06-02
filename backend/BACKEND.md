# Sistema de Gestão de Estoque e Produtos

Este diretório contém o backend do sistema para gestão de estoque, produtos e usuários, estruturado em Python, utilizando boas práticas de organização de código, separação de responsabilidades e escalabilidade.

---

## Descrição das Pastas e Arquivos

### Raiz (`backend/`)

- **.env / .env.example**: Arquivos de variáveis de ambiente. `.env.example` serve como modelo para configuração local.
- **.gitignore**: Arquivos e pastas ignorados pelo Git.
- **docker-compose.yml**: Orquestração de containers Docker para facilitar o desenvolvimento e deploy.
- **Package.json**: Dependências e scripts.
- **Alembic/**: Migrações de banco de dados utilizando Alembic.

---

### Pasta `App/`

Contém todo o código-fonte da aplicação backend.

- **__init__.py**: Indica que a pasta é um pacote Python.
- **main.py**: Ponto de entrada da aplicação (inicialização do servidor, rotas principais, etc).
- **poetry.lock / pyproject.toml**: Gerenciamento de dependências Python via Poetry.

#### Subpastas:

##### `Api/`
- **endpoints/**: Implementação dos endpoints REST da aplicação.
- **__init__.py**: Inicialização do módulo de API.

##### `Config/`
- **config.py**: Configurações gerais da aplicação (ex: leitura de variáveis de ambiente).
- **security.py**: Configurações e utilitários de segurança (ex: autenticação, criptografia).

##### `db/`
- **base.py**: Base para os modelos ORM.
- **session.py**: Gerenciamento de sessões de banco de dados.
- **models/**: Definição dos modelos/tabelas do banco de dados.
- **__init__.py**: Inicialização do módulo de banco de dados.

##### `graphql/`
- **schema.py**: Definição do schema GraphQL.
- **resolvers.py**: Funções que resolvem as queries e mutations do GraphQL.
- **__init__.py**: Inicialização do módulo GraphQL.

##### `schemas/`
- **product_schema.py**: Schemas (validações, serializações) para produtos.
- **stock_schema.py**: Schemas para estoque.
- **user_schema.py**: Schemas para usuários.
- **__init__.py**: Inicialização do módulo de schemas.

##### `Services/`
- **estoque_service.py**: Lógica de negócio relacionada ao estoque.
- **flores_service.py**: Lógica de negócio relacionada a flores/produtos.
- **__init__.py**: Inicialização do módulo de serviços.

##### `Tests/`
- Testes automatizados da aplicação (unitários, integração, etc).

---

## Como Utilizar

1. **Configuração do Ambiente**
   - Copie `.env.example` para `.env` e ajuste as variáveis conforme necessário.
   - Instale as dependências Python com Poetry:
     ```sh
     poetry install
     ```
   - Suba os serviços com Docker :
     ```sh
     docker-compose up
     ```

2. **Execução**
   - Inicie a aplicação:
     ```sh
     poetry run python App/main.py
     ```

3. **Testes**
   - Execute os testes automatizados:
     ```sh
     poetry run pytest
     ```

---

## Observações

- **Documentação**: Consulte o arquivo BACKEND.md para detalhes técnicos e exemplos de uso da API.
- **Migrações**: Utilize a pasta `Alembic/` para gerenciar versões do banco de dados.
- **Extensibilidade**: O projeto está modularizado para facilitar a adição de novas funcionalidades.

---

## Contato

Dúvidas ou sugestões? Entre em contato com a equipe de desenvolvimento.

