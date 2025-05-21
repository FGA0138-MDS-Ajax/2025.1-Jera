# Declaração de Escopo do Projeto

## Backlog do Produto

### Elicitação de Requisitos

#### Pesquisas de Mercado

#### Resultado dessas Elicitações

### Cliente Fictício: Encanto das Flores – Floricultura

#### Apresentação do Cliente

#### Cenário Atual do Cliente

#### Necessidades Relacionadas aos Requisitos do Sistema para o Cliente

### Classes de Prioridade

#### Prioridade: Must (Essenciais)

#### Prioridade: Should (Importantes, mas não vitais de imediato)

#### Prioridade: Could (Desejáveis)


## Perfis  

### Tabela: Perfis de acesso

| Nome do perfil | Características do perfil | Permissões de acesso |
|----------------|----------------------------|----------------------|
| Administrador  | Responsável pelo gerenciamento do sistema, incluindo o controle das entidades e exclusão de pedidos. Tem acesso pelo cadastro aos usuários de todos os itens do sistema suas peculiaridades. | Acesso e registro de pedidos; visualização de gráficos; emissão de relatórios; exclusão de pedidos; inclusão e exclusão de entidades; vinculação de entidades; edição de avaliações; inclusão de avaliação individual; entre outras. |
| Gerente        | Responsável pela análise dos gráficos, dashboards e pela identificação de padrões nas produções formadas. Pode acessar os gráficos das diversas cargas. Não gerencia estruturas e colegas. | Visualização de gráficos, dashboards e relatórios de produções; identificação de padrões nas produções; acesso às cargas de trabalho sem permissão de exclusão ou de gerenciamento de entidades e funcionários. |
| Operador       | Funcionário responsável pelo registro das ações de colegas e pelo registro de relatórios de perfis. | Registro de ações de colegas; visualização de registros, gráficos, cargas e relatórios; sem permissão de exclusão ou edição de entidades. |

# Tabela de Backlog do Produto

## Backlog de Requisitos

> Qualquer item sem sprint definida foi deixado propositalmente sem planejamento imediato, para evitar expectativas irreais e porque será priorizado futuramente conforme o andamento das sprints.

| Numeração | Sprint | Nome | Tipo | Priorização | Descrição | User Story |
|------------|--------|------|------|-------------|-----------|------------|
| 1.1 | 7 | Cadastro de flores | Funcional | Must | Permitir o cadastro de flores com atributos básicos. | Como administrador, quero cadastrar flores com atributos identificadores para organizar que flores podem ser registradas para funcionários. |
| 1.2 | 7 | Registrar Entradas e Saídas de Estoque | Funcional | Must | Registrar movimentações em tempo real com data, quantidade, motivo e responsável. | Como funcionário, quero registrar saídas de flores para manter o estoque atualizado. |
| 1.3 | 7 | Registrar flores | Funcional | Must | Registrar flores para poderem ser quantificadas e avaliadas posteriormente. | Como funcionário, quero registrar as flores e seus estados. |
| 1.3 | 8 | Controle de Validade e Lote | Funcional | Must | Associar data de validade aos produtos e alertar quando próximos do vencimento. | Como gerente, quero ser alertado sobre flores e insumos vencendo para evitar perdas. |
| 1.4 | 8 | Estoque mínimo e máximo | Funcional | Must | Definir faixas de estoque por item e alertar quando abaixo ou acima do ideal. | Como administrador, quero configurar níveis mínimos para evitar rupturas de flores e materiais. |
| 1.5 | 8 | Consulta Rápida de Produtos | Funcional | Must | Pesquisar produtos pelo nome, tipo, validade ou quantidade. | Como florista, quero localizar rapidamente produtos específicos no estoque. |
| 1.6 | 8 | Alerta de Produtos com Baixo Giro | Funcional | Must | Listar produtos parados no estoque por muito tempo. | Como administrador, quero identificar flores que não estão saindo para planejar promoções. |
| 1.7 | 9 | Leitura de QR Code | Funcional | Should | Permitir leitura de QR Code para identificar produtos e lotes. | Como operador, quero usar QR Code para registrar movimentações rapidamente. |
| 1.8 | 9 | Cadastro de insumos e materiais de apoio | Funcional | Should | Permitir o cadastro de materiais com categorias e atributos básicos. | Como administrador, quero cadastrar flores com categorias para organizar o estoque da floricultura. |
| 1.9 | | Painel de Indicadores (Dashboard) | Funcional | Should | Mostrar métricas: vencimentos, estoque baixo, movimentações recentes. | Como analista, quero visualizar os indicadores principais do estoque em uma única tela. |
| 1.10 | | Relatórios Exportáveis (Excel/PDF) | Funcional | Could | Permitir exportar relatórios de estoque e movimentações. | Como gestor, quero gerar relatórios para reuniões e análises externas. |
| 1.11 | | Histórico de Movimentações por Item | Funcional | Could | Exibir o histórico de entradas e saídas de cada item do estoque. | Como administrador, quero consultar o histórico de um produto para entender seu fluxo de uso. |
| 1.12 | | Notificações Visuais no Sistema | Funcional | Could | Alertas no topo da tela sobre validade, rupturas e excesso de estoque. | Como gerente, quero ser alertado automaticamente sem precisar buscar manualmente. |
| 1.13 | | Controle por Estado Estético | Funcional | Should | Permitir marcar flores como "boas", "murchando" ou "descartáveis" com alerta. | Como operador, quero registrar o estado das flores para facilitar decisões no armazém. |
| 1.14 | | Relatório de Perdas com Motivos | Funcional | Could | Registrar e visualizar os motivos das perdas (murcha, pragas etc.). | Como analista/administrador, quero acompanhar por que estou perdendo flores para tomar decisões melhores. |




## Backlog de Débitos Técnicos
| Numeração | Sprint | Nome | Tipo | Priorização | Descrição | User Story |
|------------|--------|------|------|-------------|-----------|------------|
| DT01 | Todos | Resolução de Bugs e Issues | Dívida Técnica | Must | Corrigir falhas do sistema. | Como usuário, quero que o sistema funcione corretamente. |
| DT02 | 8 | Configuração do Servidor | Dívida Técnica | Must | Preparar ambiente de backend / produção. | Como dev, preciso de um ambiente pronto para programar e testar. |
| DT03 | Todos | Refatoração de Código | Dívida Técnica | Should | Melhorar qualidade e legibilidade do código. | Como dev, quero manter o código sustentável para futuras mudanças. |


## Backlog de Suporte/Processo


| Numeração | Sprint | Nome | Tipo | Priorização | Descrição | User Story |
|------------|--------|------|------|-------------|-----------|------------|
| S01 | 7 | Prototipagem e Design | Processo | Should | Criar protótipos das telas principais. | Como stakeholder, quero visualizar o sistema antes de desenvolvê-lo. |
| S02 | 2 até 6 | Pesquisa Técnicas | Processo | Could | Investigar soluções técnicas. | Como dev, quero validar tecnologias e abordagens antes de implementá-las. |
| S03 | Todos | Revisões e Auditorias | Suporte | Should | Avaliar código, design e decisões técnicas. | Como equipe, queremos garantir a qualidade do projeto. |

---

## Backlog de Testes

| Numeração | Sprint | Nome | Tipo | Priorização | Descrição | User Story |
|------------|--------|------|------|-------------|-----------|------------|
| T01 | Todos | Teste de Unidade | Processo (Qualidade) | Must | Verificar cada função individualmente. | Como dev, quero garantir que os módulos funcionem corretamente. |


