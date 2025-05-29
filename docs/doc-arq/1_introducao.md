# Documento de Arquitetura - FloraGest

## Propósito

Este documento tem como propósito descrever a arquitetura do sistema **FloraGest**, desenvolvido na disciplina de **Métodos de Desenvolvimento de Software (MDS)**, no primeiro semestre de 2025.

Ele fornece uma visão abrangente da estrutura arquitetural, tecnologias utilizadas, padrões adotados, metas, restrições e principais componentes do sistema. 

Este documento serve como referência tanto para os membros da equipe de desenvolvimento quanto para demais stakeholders envolvidos, como testadores e clientes.

## Escopo

O escopo deste documento abrange a definição e descrição dos componentes arquiteturais do **FloraGest**, uma plataforma de gestão de estoque voltada para pequenas e médias floriculturas.

O sistema visa automatizar o controle de estoque de produtos perecíveis, como flores e insumos, oferecendo funcionalidades como:

- Cadastro de produtos e flores;
- Controle de entrada e saída de estoque;
- Gerenciamento de validade e estado estético dos itens;
- Alertas inteligentes para:
  - Estoque baixo;
  - Validade próxima;
  - Produtos com baixo giro;
- Dashboards e relatórios analíticos;
- Controle de acesso com diferentes perfis:
  - Administrador;
  - Gerente;
  - Operador.

Este documento se fundamenta nos requisitos detalhados no **Documento de Visão** e na **Declaração de Escopo do Produto**, que foram previamente entregues.

A arquitetura proposta tem como objetivo garantir:

- Alta usabilidade;
- Confiabilidade;
- Desempenho;
- Escalabilidade.

Tudo isso alinhando-se às necessidades do cliente fictício **Encanto das Flores** e às características específicas do mercado de floriculturas.

Além disso, contempla as escolhas de tecnologias feitas:

- **Frontend:** React;
- **Backend:** Python com FastAPI;
- **Banco de Dados:** MySQL.

Bem como os padrões arquiteturais, que priorizam:

- Modularidade;
- Manutenibilidade;
- Facilidade de evolução do sistema.
