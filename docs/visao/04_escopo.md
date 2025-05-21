# Declaração de Escopo do Projeto

## Backlog do Produto

### Elicitação de Requisitos

Para identificar os requisitos mais relevantes e coerentes com a realidade de floriculturas de pequeno e médio porte para podermos fazer o backlog do produto, foi realizado um processo de elicitação baseado em diferentes técnicas de levantamento e análise de mercado. O foco foi identificar lacunas existentes e oportunidades de inovação digital no setor.

#### Pesquisas de Mercado

Inicialmente, conduzimos uma pesquisa exploratória em plataformas de distribuição de software como a Google Play Store e Apple App Store, além de buscadores na internet, com o objetivo de localizar soluções existentes voltadas especificamente para “gestão de estoque em floriculturas”.

Apesar de já existirem diversos sites e aplicativos voltados ao controle de estoque de uso geral, nenhuma solução encontrada era realmente especializada nas particularidades do setor de floricultura, como o controle de perecibilidade de flores, o estado estético dos produtos, ou o acompanhamento por espécie vegetal.

Além da pesquisa digital, foram consideradas:

- Estudos de caso de floriculturas manuais (com controles em cadernos ou planilhas);
- Análise de funcionalidades de ERPs genéricos e como poderiam ser adaptadas ao contexto floral.

#### Resultado dessas Elicitações

Como resultado desse processo, foram definidos requisitos que atendem diretamente às dores e necessidades específicas das floriculturas, como:

- Controle de validade e estado estético dos produtos.
- Relatórios de perdas com categorização por motivo.
- Sugestões de promoções baseadas em baixo giro.
- Registro de cuidados por espécie e integração com APIs de clima, otimizando a conservação das plantas.

### Cliente Fictício: Encanto das Flores – Floricultura

**Razão Social:** Encanto das Flores Comércio de Plantas e Arranjos LTDA  
**Nome Fantasia:** Encanto das Flores  
**CNPJ:** 12.345.678/0001-90  
**Endereço:** Rua das Acácias, 120 – Centro, Nova Primavera – SP  
**Telefone:** (11) 3222-4567  
**Responsável Técnico:** Mariana Silva, Engenheira Agrônoma e Gestora de Estoque  
**Número de Funcionários:** 12  
**Segmento:** Floricultura de médio porte com foco em vendas diretas ao consumidor, eventos e fornecimento para hotéis e decoradores.  

#### Apresentação do Cliente

A Encanto das Flores é uma floricultura de médio porte com 10 anos de atuação no mercado regional, especializada na venda de flores ornamentais, arranjos personalizados e plantas decorativas. Seu principal diferencial está na qualidade e frescor das flores, com atendimento personalizado e entregas sob demanda.

Apesar de bem estabelecida no mercado, a empresa enfrenta desafios sérios com o controle de estoque de produtos perecíveis, ocasionando perdas por murchamento, excesso de compras ou rupturas inesperadas. Além disso, boa parte do processo ainda é manual ou feito em planilhas, dificultando a previsibilidade e rastreabilidade dos produtos.

#### Cenário Atual do Cliente

- Utiliza cadernos e planilhas para controle de estoque.
- Registra perdas semanalmente, especialmente em flores de curta durabilidade.
- Dificuldade em prever sazonalidade e manter informações de validade de insumos.
- Recebe feedback negativo sobre alguns arranjos entregues com flores "não frescas".
- Está em processo de digitalização e procura uma solução que se adapte ao ritmo do negócio, sem exigir infraestrutura robusta.

#### Necessidades Relacionadas aos Requisitos do Sistema para o Cliente

|                  **Necessidade do Cliente**                 |                           **Requisitos do Sistema Relacionados**                           |
|:-----------------------------------------------------------:|:------------------------------------------------------------------------------------------:|
| Evitar perdas por validade vencida ou mau estado das flores | Controle de Validade e Lote, Controle por Estado Estético, Relatório de Perdas com Motivos |
|          Automatizar o controle de entrada e saída          |         Registrar Entradas e Saídas de Estoque, Histórico de Movimentações por Item        |
|       Identificar rapidamente produtos com baixa saída      |            Alerta de Produtos com Baixo Giro, Painel de Indicadores (Dashboard)            |
|   Cadastro e separação por espécie para cuidados distintos  |                    Cadastro de Flores, Registro de Cuidados por Espécie                    |
|      Gerar relatórios e análises para tomada de decisão     |                  Relatórios Exportáveis (Excel/PDF), Painel de Indicadores                 |
|     Consulta rápida ao sistema por todos os funcionários    |                Consulta Rápida de Produtos, Notificações Visuais no Sistema                |
| Melhor organização do estoque com diferentes tipos de itens |              Cadastro de Insumos e Materiais de Apoio, Estoque mínimo e máximo             |
|  Automatização de identificação de lotes e rastreabilidade  |                                     Leitura de QR Code                                     |
|         Previsão de cuidados com base no clima local        |                                  Verificar Clima Integrado                                 |

### Classes de Prioridade

Com base nos requisitos levantados e nas necessidades do cliente Encanto das Flores, foi construído o backlog inicial do produto. Os itens foram organizados em histórias de usuário e classificadas segundo sua prioridade utilizando o modelo MoSCoW:

#### Prioridade: Must (Essenciais)

| **ID** |                                      **Justificativa da Prioridade (Must)**                                      |
|:------:|:----------------------------------------------------------------------------------------------------------------:|
|   1.1  |   O cadastro de flores é a base do sistema — sem isso, não há como registrar, controlar ou consultar produtos.   |
|   1.2  |  O controle de movimentações é essencial para manter o estoque atualizado e confiável, evitando erros e perdas.  |
|   1.3  |       Como o produto é perecível, o controle de validade é vital para evitar prejuízos com flores vencidas.      |
|   1.4  | O controle de níveis de estoque evita rupturas e excessos, fundamentais para manter o fluxo de vendas eficiente. |
|   1.5  |  A consulta rápida é essencial no dia a dia da operação da floricultura, otimizando o atendimento e a reposição. |
|   1.6  |          Identificar produtos com baixa saída permite ações rápidas, como promoções, para evitar perdas.         |

#### Prioridade: Should (Importantes, mas não vitais de imediato)

| **ID** |                                             **Justificativa da Prioridade (Should)**                                             |
|:------:|:--------------------------------------------------------------------------------------------------------------------------------:|
|   1.7  |      A leitura de QR Code agiliza processos e reduz erros, mas não é indispensável no início. Pode ser implementada depois.      |
|   1.8  |           O cadastro de insumos ajuda na organização geral, mas o foco inicial está nas flores, que são mais críticas.           |
|   1.9  |       Um painel de indicadores melhora a visualização estratégica, mas é possível operar com relatórios manuais no começo.       |
|  1.13  | Marcar o estado estético das flores ajuda a evitar perdas, mas pode ser feito manualmente até a funcionalidade ser automatizada. |

#### Prioridade: Could (Desejáveis)

| **ID** |                                               **Justificativa da Prioridade (Could)**                                              |
|:------:|:----------------------------------------------------------------------------------------------------------------------------------:|
|  1.10  |      Exportar relatórios facilita reuniões e tomadas de decisão, mas pode ser feito copiando dados manualmente, se necessário.     |
|  1.11  |       Ter o histórico detalhado de movimentações é útil para auditoria, mas não impacta o funcionamento imediato do estoque.       |
|  1.12  | As notificações visuais ajudam na proatividade do time, mas podem ser substituídas temporariamente por boas práticas operacionais. |
|  1.14  |      Relatórios de perdas por motivo são valiosos para análise estratégica, mas não impedem o funcionamento básico do sistema.     |

## Perfis

| **Nome do perfil** |                                                                                    **Características do perfil**                                                                                   |                                                                                                                    **Permissões de acesso**                                                                                                                    |
|:------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|    Administrador   |      Responsável pelo gerenciamento do estoque, incluindo o controle das entradas e saídas de produtos. Bem como pelo cadastro e atualização de novos itens no sistema e suas peculiaridades.      | Adição e remoção de produtos; registro de entradas ou de saídas do estoque; consulta aos produtos disponíveis e seu estoque, validade, lote e estética; definição do estoque mínimo ou máximo; definição e visualização dos registros de cuidados por espécie. |
|       Gerente      | Responsável pela análise dos gráficos, dos alertas e dos relatórios fornecidos pelo sistema para melhor gestão do estoque. Bem como a gestão dos demais cargos. Não gerindo diretamente o estoque. |                                              Visualização dos gráficos, alertas e relatórios fornecidos pelo sistema; visualização dos relatórios de perda; atribuições de cargos e gerenciamento de funcionários.                                             |
|      Operador      |                                                 Funcionário responsável pelo registro de saídas do estoque e pelo registro de relatórios de perda.                                                 |                               Registro de saídas do estoque; consulta aos produtos disponíveis e seu estoque, validade, lote e estética; realização dos relatórios de perda; visualização dos registros de cuidados por espécie.                               |

## Tabela de Backlog do Produto

### Backlog de Requisitos

| **ID** |           **Épico/História**           |                                   **Descrição**                                   | **Prioridade** | **Status** |                                                            **User Story (U.S.)**                                                            |
|:------:|:--------------------------------------:|:---------------------------------------------------------------------------------:|:--------------:|:----------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
|   1.1  |           Cadastro de flores           |                Permitir o cadastro de flores com atributos básicos.               |      Must      |   A fazer  | Como administrador, quero cadastrar flores com atributos identificadores para organizar que flores podem ser registradas para funcionários. |
|   1.2  | Registrar Entradas e Saídas de Estoque | Registrar movimentações em tempo real com data, quantidade, motivo e responsável. |      Must      |   A fazer  |                             Como funcionário, quero registrar saídas de flores para manter o estoque atualizado.                            |
|   1.3  |            Registrar flores            |    Registrar flores para poderem ser quantificadas e avaliadas posteriormente.    |      Must      |   A fazer  |                                         Como funcionário, quero registrar as flores e seus estados.                                         |
|   1.4  |       Controle de Validade e Lote      |  Associar data de validade aos produtos e alertar quando próximos do vencimento.  |      Must      |   A fazer  |                             Como gerente, quero ser alertado sobre flores e insumos vencendo para evitar perdas.                            |
|   1.5  |         Estoque mínimo e máximo        |   Definir faixas de estoque por item e alertar quando abaixo ou acima do ideal.   |      Must      |   A fazer  |                       Como administrador, quero configurar níveis mínimos para evitar rupturas de flores e materiais.                       |
|   1.6  |       Consulta Rápida de Produtos      |            Pesquisar produtos pelo nome, tipo, validade ou quantidade.            |      Must      |   A fazer  |                                 Como florista, quero localizar rapidamente produtos específicos no estoque.                                 |
|   1.7  |    Alerta de Produtos com Baixo Giro   |                Listar produtos parados no estoque por muito tempo.                |      Must      |   A fazer  |                          Como administrador, quero identificar flores que não estão saindo para planejar promoções.                         |
|   1.8  |           Leitura de QR Code           |           Permitir leitura de QR Code para identificar produtos e lotes.          |     Should     |   A fazer  |                                 Como operador, quero usar QR Code para registrar movimentações rapidamente.                                 |
|   1.9  |     Cadastro de insumos e materiais    |        Permitir o cadastro de materiais com categorias e atributos básicos.       |     Should     |   A fazer  |                     Como administrador, quero cadastrar flores com categorias para organizar o estoque da floricultura.                     |
|  1.10  |    Painel de Indicadores (Dashboard)   |       Mostrar métricas: vencimentos, estoque baixo, movimentações recentes.       |     Should     |   A fazer  |                           Como analista, quero visualizar os indicadores principais do estoque em uma única tela.                           |
|  1.11  |   Relatórios Exportáveis (Excel/PDF)   |              Permitir exportar relatórios de estoque e movimentações.             |      Could     |   A fazer  |                                    Como gestor, quero gerar relatórios para reuniões e análises externas.                                   |
|  1.12  |   Histórico de Movimentações por Item  |          Exibir o histórico de entradas e saídas de cada item do estoque.         |      Could     |   A fazer  |                        Como administrador, quero consultar o histórico de um produto para entender seu fluxo de uso.                        |
|  1.13  |     Notificações Visuais no Sistema    |       Alertas no topo da tela sobre validade, rupturas e excesso de estoque.      |      Could     |   A fazer  |                              Como gerente, quero ser alertado automaticamente sem precisar buscar manualmente.                              |
|  1.14  |      Controle por Estado Estético      |   Permitir marcar flores como "boas", "murchando" ou "descartáveis" com alerta.   |     Should     |   A fazer  |                 Como operador, quero registrar o estado das flores para facilitar decisões com o armazém de flores/plantas.                 |
|  1.15  |     Relatório de Perdas com Motivos    |        Registrar e visualizar os motivos das perdas (murcha, pragas etc.).        |      Could     |   A fazer  |                  Como analista/administrador, quero acompanhar por que estou perdendo flores para tomar decisões melhores.                  |

## Backlog de Débitos Técnicos

**Backlog de Requisitos – Débitos Técnicos**

| **Numeração** | **Sprint** | **Nome dos Débitos Técnicos** | **Tipo de Requisito** | **Priorização** |      **Descrição sucinta do requisito**     |                   **User Story (U.S.) associada**                  |
|:-------------:|:----------:|:-----------------------------:|:---------------------:|:---------------:|:-------------------------------------------:|:------------------------------------------------------------------:|
|      DT01     |    todos   |   Resolução de Bugs e Issues  |     Dívida Técnica    |       Must      |         Corrigir falhas do sistema.         |      Como usuário, quero que o sistema funcione corretamente.      |
|      DT02     |            |    Configuração do Servidor   |     Dívida Técnica    |       Must      |   Preparar ambiente de backend / produção   |  Como dev, preciso de um ambiente pronto para programar e testar.  |
|      DT03     |            |     Refatoração de Código     |     Dívida Técnica    |      Should     | Melhorar qualidade e legibilidade do código | Como dev, quero manter o código sustentável para futuras mudanças. |

## Backlog de Documentação

**Backlog de Requisitos – Documentação**

| **Numeração** | **Sprint** | **Nome das Documentações** | **Tipo de Requisito** | **Priorização** |        **Descrição sucinta do requisito**        |                           **User Story (U.S.) associada**                          |
|:-------------:|:----------:|:--------------------------:|:---------------------:|:---------------:|:------------------------------------------------:|:----------------------------------------------------------------------------------:|
|      DO01     |            |   Diagrama de arquitetura  |      Documentação     |       Must      | Definir componentes principais e estrutura geral |         Como desenvolvedor, quero entender como o sistema será estruturado.        |
|      DO02     |            |     Fluxo de navegação     |      Documentação     |       Must      |     Mapear a navegação entre telas (frontend)    | Como desenvolvedor frontend, quero entender como o usuário interage com o sistema. |
|      DO03     |            |        Casos de Uso        |      Documentação     |       Must      |           Descrever cenários funcionais          |       Como desenvolvedor, quero saber como o usuário interage com o sistema.       |
|      DO04     |            |   Diagrama de Atividades   |      Documentação     |       Must      |            Fluxo de ações dos usuários           |           Como desenvolvedor, quero visualizar o comportamento esperado.           |
|      DO05     |            |     Mapa de componentes    |      Documentação     |       Must      |          Mapear módulos e suas relações          |          Como desenvolvedor, queremos dividir o sistema em partes lógicas.         |

## Backlog de Suporte/Processo

**Backlog de Requisitos – Suporte/Processo**

| **Numeração** | **Sprint** | **Nome dos Suportes/Processos** | **Tipo de Requisito** | **Priorização** |     **Descrição sucinta do requisito**     |                      **User Story (U.S.) associada**                      |
|:-------------:|:----------:|:-------------------------------:|:---------------------:|:---------------:|:------------------------------------------:|:-------------------------------------------------------------------------:|
|      S01      |            |      Prototipagem e Design      |        Processo       |      Should     |   Criar protótipos das telas principais.   |    Como stakeholder, quero visualizar o sistema antes de desenvolvê-lo.   |
|      S02      |            |        Pesquisa técnicas        |        Processo       |      Could      |        Investigar soluções técnicas        | Como dev, quero validar tecnologias e abordagens antes de implementá-las. |
|      S03      |    todos   |      Revisões e auditorias      |        Suporte        |      Should     | Avaliar código, design e decisões técnicas |           Como equipe, queremos garantir a qualidade do projeto.          |

## Backlog de Testes

**Backlog de Requisitos – Testes**

| **Numeração** | **Sprint** | **Nome dos Testes de Software** | **Tipo de Requisito** | **Priorização** |   **Descrição sucinta do requisito**  |                 **User Story (U.S.) associada**                 |
|:-------------:|:----------:|:-------------------------------:|:---------------------:|:---------------:|:-------------------------------------:|:---------------------------------------------------------------:|
|      T01      |    Todos   |         Teste de unidade        |  Processo (Qualidade) |       Must      | Verificar cada função individualmente | Como dev, quero garantir que os módulos funcionem corretamente. |
