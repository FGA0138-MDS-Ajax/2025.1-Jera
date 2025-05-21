# Backlog do Produto

## Backlog de Requisitos
**Backlog de Requisitos**

| ID   | Épico/História                       | Descrição                                                                                       | Prioridade | Status    | User Story (U.S.)                                                                                                     |
|------|--------------------------------------|-------------------------------------------------------------------------------------------------|------------|-----------|----------------------------------------------------------------------------------------------------------------------|
| 1.1  | Cadastro de flores                   | Permitir o cadastro de flores com atributos básicos.                                            | Must       | A fazer   | Como administrador, quero cadastrar flores com atributos identificadores para organizar que flores podem ser registradas para funcionários. |
| 1.2  | Registrar Entradas e Saídas de Estoque| Registrar movimentações em tempo real com data, quantidade, motivo e responsável.               | Must       | A fazer   | Como funcionário, quero registrar saídas de flores para manter o estoque atualizado.                                 |
| 1.3  | Registrar flores                     | Registrar flores para poderem ser quantificadas e avaliadas posteriormente.                     | Must       | A fazer   | Como funcionário, quero registrar as flores e seus estados.                                                          |
| 1.4  | Controle de Validade e Lote          | Associar data de validade aos produtos e alertar quando próximos do vencimento.                 | Must       | A fazer   | Como gerente, quero ser alertado sobre flores e insumos vencendo para evitar perdas.                                 |
| 1.5  | Estoque mínimo e máximo              | Definir faixas de estoque por item e alertar quando abaixo ou acima do ideal.                   | Must       | A fazer   | Como administrador, quero configurar níveis mínimos para evitar rupturas de flores e materiais.                      |
| 1.6  | Consulta Rápida de Produtos          | Pesquisar produtos pelo nome, tipo, validade ou quantidade.                                     | Must       | A fazer   | Como florista, quero localizar rapidamente produtos específicos no estoque.                                           |
| 1.7  | Alerta de Produtos com Baixo Giro    | Listar produtos parados no estoque por muito tempo.                                             | Must       | A fazer   | Como administrador, quero identificar flores que não estão saindo para planejar promoções.                           |
| 1.8  | Leitura de QR Code                   | Permitir leitura de QR Code para identificar produtos e lotes.                                  | Should     | A fazer   | Como operador, quero usar QR Code para registrar movimentações rapidamente.                                          |
| 1.9  | Cadastro de insumos e materiais      | Permitir o cadastro de materiais com categorias e atributos básicos.                            | Should     | A fazer   | Como administrador, quero cadastrar flores com categorias para organizar o estoque da floricultura.                  |
| 1.10 | Painel de Indicadores (Dashboard)    | Mostrar métricas: vencimentos, estoque baixo, movimentações recentes.                           | Should     | A fazer   | Como analista, quero visualizar os indicadores principais do estoque em uma única tela.                              |
| 1.11 | Relatórios Exportáveis (Excel/PDF)   | Permitir exportar relatórios de estoque e movimentações.                                        | Could      | A fazer   | Como gestor, quero gerar relatórios para reuniões e análises externas.                                               |
| 1.12 | Histórico de Movimentações por Item  | Exibir o histórico de entradas e saídas de cada item do estoque.                                | Could      | A fazer   | Como administrador, quero consultar o histórico de um produto para entender seu fluxo de uso.                        |
| 1.13 | Notificações Visuais no Sistema      | Alertas no topo da tela sobre validade, rupturas e excesso de estoque.                          | Could      | A fazer   | Como gerente, quero ser alertado automaticamente sem precisar buscar manualmente.                                    |
| 1.14 | Controle por Estado Estético         | Permitir marcar flores como "boas", "murchando" ou "descartáveis" com alerta.                   | Should     | A fazer   | Como operador, quero registrar o estado das flores para facilitar decisões com o armazém de flores/plantas.          |
| 1.15 | Relatório de Perdas com Motivos      | Registrar e visualizar os motivos das perdas (murcha, pragas etc.).                             | Could      | A fazer   | Como analista/administrador, quero acompanhar por que estou perdendo flores para tomar decisões melhores.            |

## Backlog de Débitos Técnicos

**Backlog de Requisitos – Débitos Técnicos**

| Numeração | Sprint | Nome dos Débitos Técnicos    | Tipo de Requisito | Priorização | Descrição sucinta do requisito           | User Story (U.S.) associada                                                        |
|-----------|--------|-----------------------------|-------------------|-------------|------------------------------------------|-------------------------------------------------------------------------------------|
| DT01      | todos  | Resolução de Bugs e Issues  | Dívida Técnica    | Must        | Corrigir falhas do sistema.              | Como usuário, quero que o sistema funcione corretamente.                            |
| DT02      |        | Configuração do Servidor    | Dívida Técnica    | Must        | Preparar ambiente de backend / produção  | Como dev, preciso de um ambiente pronto para programar e testar.                    |
| DT03      |        | Refatoração de Código       | Dívida Técnica    | Should      | Melhorar qualidade e legibilidade do código | Como dev, quero manter o código sustentável para futuras mudanças.               |

## Backlog de Documentação

**Backlog de Requisitos – Documentação**

| Numeração | Sprint | Nome das Documentações    | Tipo de Requisito | Priorização | Descrição sucinta do requisito           | User Story (U.S.) associada                                                        |
|-----------|--------|--------------------------|-------------------|-------------|------------------------------------------|-------------------------------------------------------------------------------------|
| DO01      |        | Diagrama de arquitetura  | Documentação      | Must        | Definir componentes principais e estrutura geral | Como desenvolvedor, quero entender como o sistema será estruturado.           |
| DO02      |        | Fluxo de navegação       | Documentação      | Must        | Mapear a navegação entre telas (frontend) | Como desenvolvedor frontend, quero entender como o usuário interage com o sistema. |
| DO03      |        | Casos de Uso             | Documentação      | Must        | Descrever cenários funcionais            | Como desenvolvedor, quero saber como o usuário interage com o sistema.             |
| DO04      |        | Diagrama de Atividades   | Documentação      | Must        | Fluxo de ações dos usuários              | Como desenvolvedor, quero visualizar o comportamento esperado.                      |
| DO05      |        | Mapa de componentes      | Documentação      | Must        | Mapear módulos e suas relações           | Como desenvolvedor, queremos dividir o sistema em partes lógicas.                   |

## Backlog de Suporte/Processo

**Backlog de Requisitos – Suporte/Processo**

| Numeração | Sprint | Nome dos Suportes/Processos   | Tipo de Requisito | Priorização | Descrição sucinta do requisito         | User Story (U.S.) associada                                                        |
|-----------|--------|------------------------------|-------------------|-------------|----------------------------------------|-------------------------------------------------------------------------------------|
| S01       |        | Prototipagem e Design        | Processo          | Should      | Criar protótipos das telas principais. | Como stakeholder, quero visualizar o sistema antes de desenvolvê-lo.                |
| S02       |        | Pesquisa técnicas            | Processo          | Could       | Investigar soluções técnicas           | Como dev, quero validar tecnologias e abordagens antes de implementá-las.           |
| S03       | todos  | Revisões e auditorias        | Suporte           | Should      | Avaliar código, design e decisões técnicas | Como equipe, queremos garantir a qualidade do projeto.                          |

## Backlog de Testes

**Backlog de Requisitos – Testes**

| Numeração | Sprint | Nome dos Testes de Software | Tipo de Requisito      | Priorização | Descrição sucinta do requisito      | User Story (U.S.) associada                                               |
|-----------|--------|----------------------------|------------------------|-------------|-------------------------------------|----------------------------------------------------------------------------|
| T01       | Todos  | Teste de unidade           | Processo (Qualidade)   | Must        | Verificar cada função individualmente | Como dev, quero garantir que os módulos funcionem corretamente.            |

## Justificativas das Prioridades Must

**Justificativa para Requisitos Prioritários (Must)**

| ID   | Justificativa da Prioridade                                                                                  |
|------|--------------------------------------------------------------------------------------------------------------|
| 1.1  | O cadastro de flores é a base do sistema — sem isso, não há como registrar, controlar ou consultar produtos.|
| 1.2  | O controle de movimentações é essencial para manter o estoque atualizado e confiável, evitando erros e perdas.|
| 1.3  | Como o produto é perecível, o controle de validade é vital para evitar prejuízos com flores vencidas.       |
| 1.4  | O controle de níveis de estoque evita rupturas e excessos, fundamentais para manter o fluxo de vendas eficiente.|
| 1.5  | A consulta rápida é essencial no dia a dia da operação da floricultura, otimizando o atendimento e a reposição.|
| 1.6  | Identificar produtos com baixa saída permite ações rápidas, como promoções, para evitar perdas.             |

## Justificativas das Prioridades Should

**Justificativa para Requisitos Prioritários (Should)**

| ID   | Justificativa da Prioridade                                                                                  |
|------|--------------------------------------------------------------------------------------------------------------|
| 1.7  | A leitura de QR Code agiliza processos e reduz erros, mas não é indispensável no início. Pode ser implementada depois. |
| 1.8  | O cadastro de insumos ajuda na organização geral, mas o foco inicial está nas flores, que são mais críticas. |
| 1.9  | Um painel de indicadores melhora a visualização estratégica, mas é possível operar com relatórios manuais no começo. |
| 1.13 | Marcar o estado estético das flores ajuda a evitar perdas, mas pode ser feito manualmente até a funcionalidade ser automatizada. |

## Justificativas das Prioridades Could

**Justificativa para Requisitos Prioritários (Could)**

| ID   | Justificativa da Prioridade                                                                                  |
|------|--------------------------------------------------------------------------------------------------------------|
| 1.10 | Exportar relatórios facilita reuniões e tomadas de decisão, mas pode ser feito copiando dados manualmente, se necessário. |
| 1.11 | Ter o histórico detalhado de movimentações é útil para auditoria, mas não impacta o funcionamento imediato do estoque. |
| 1.12 | As notificações visuais ajudam na proatividade do time, mas podem ser substituídas temporariamente por boas práticas operacionais. |
| 1.14 | Relatórios de perdas por motivo são valiosos para análise estratégica, mas não impedem o funcionamento básico do sistema. |
