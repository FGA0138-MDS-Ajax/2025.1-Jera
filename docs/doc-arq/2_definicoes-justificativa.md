## Representação Arquitetural

### Definições

O sistema seguirá o estilo arquitetural de *N-camadas*, usando o padrão *MVC (Model, View, Controller)* para estruturar a aplicação em uma camada de dados, uma camada de lógica negocial e uma camada de visualização exposta ao usuário. As camadas de dados e de regras negociais compõem um *back-end monolítico*, acessado por um *front-end* implementado separadamente na camada de visualização.

- **Model**: Chamada aqui de *camada de dados*, é considerada a de mais baixo nível do nosso sistema, proporcionando para a camada de lógica negocial uma abstração sobre o sistema de persistência de dados. Essa camada deve garantir a consistência e segurança nas transações com o banco de dados através de uma API enxuta e validações básicas.

- **Controller**: Chamada aqui de *camada de lógica negocial*, é a parte de mais alto nível do *back-end* da aplicação. É responsável por processar requisições e emitir respostas, providenciando para a camada de visualização uma abstração de alto nível do sistema de persistência de dados, realizando validações referentes às regras de negócio obtidas dos requisitos e fazendo uso da camada de dados para armazenar e recuperar informações.

- **View**: *Camada de visualização* que representa o *front-end* da aplicação. É responsável pela interface exposta ao usuário da aplicação, fazendo uso da camada de regras negociais para que o usuário possa inserir, recuperar, modificar e visualizar informações referentes ao negócio dele.

### Justificativa

De acordo com a seção 1 do documento de visão, este produto tem como objetivo resolver o problema de gestão de estoque de pequenas e médias empresas no ramo de floricultura através de uma plataforma digital.

Tendo em vista o objetivo da aplicação, é possível assumir que não haverá um fluxo intenso de usuários e que não se espera interações que exigem resposta em tempo real. Com base nisso, o padrão arquitetural *MVC* foi escolhido por ser bem consolidado e de fácil implementação considerando a capacidade do time e os prazos estipulados para desenvolvimento.

Além disso, essa arquitetura se apresenta suficiente para abarcar as complexidades do projeto proposto.

A escolha por um *back-end* monolítico visa reduzir ainda mais a complexidade de implementação, e um *front-end* separado permite flexibilidade para caso seja decidido fornecer suporte a dispositivos móveis.


