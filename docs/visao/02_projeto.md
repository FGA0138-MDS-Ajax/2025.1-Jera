# Visão Geral do Projeto

## Ciclo de vida do projeto de desenvolvimento de software

Será adotado um modelo incremental baseado em SCRUM e XP, com entregas realizadas em sprints semanais. Esse ciclo de vida foi escolhido porque permite o desenvolvimento e evolução contínua do sistema com base no feedback constante dos membros, além de promover alta colaboração da equipe.

Essa escolha se deve principalmente à possibilidade de maleabilidade do produto conforme o construímos. Isso é algo extremamente importante, considerando nossa inexperiência no desenvolvimento de software em grupo. Por esse motivo, esperamos que muitos erros com prazos e funcionalidades aconteçam ao longo do caminho. 
Por essa razão, precisamos do método mais adaptável e ágil, que nos permita acompanhar o progresso constante dos membros e garantir que as coisas não saiam do controle. Assim, o método SCRUM foi o que mais se encaixou em nosso perfil e contexto.

## Organização do Projeto

|                    **Papel**                   |                                                **Atribuições**                                                |  **Responsável** |               **Participantes**               |
|:----------------------------------------------:|:-------------------------------------------------------------------------------------------------------------:|:----------------:|:---------------------------------------------:|
|                     Gerente                    |                                Organização do grupo e das reuniões de sprints.                                |   João Gabriel   |                  João Gabriel                 |
|           API’s, autenticação, Docker          |               Criar as API’s, autenticação do site, Organizar o Docker, além de fazer o backlog.              |   Lucas Andrade  |           Lucas Andrade e João Pedro          |
| Desenvolvimento, integração com banco e testes | Desenvolver a infraestrutura do código principal, incluindo código de integração com o banco e alguns testes. |    Pablo Cunha   | Pablo Cunha, Lucas Borges e  Liander Medeiros |
|                Criação front-end               |                              Implementar as soluções visuais do site por código.                              |   Daniel Nunes   |          Daniel Nunes e Robson Junior         |
|               Arquitetura de site              |                Fará todas as decisões de arquitetura visual e como usuários navegarem no site.                | Bernardo Broetto |         Bernardo Broetto e  João Vitor        |
|   Documentação ER banco e Integração back-end  |                               Organizará como o banco de dados será estruturado                               | Brunno Fernandes |       Brunno Fernandes e Rafaela Andrea       |
|       Modelagem de banco e consultas SQL       |                          Criará o banco de dados, consultas e hospedagem desse banco.                         |  Luis Zarbielli  |        Luis Zarbielli e Rafaela Andrea        |
|                     Cliente                    |                                         ...Não se esqueçam do cliente.                                        |        ...       |                     Todos                     |

## Planejamento das Fases e/ou Iterações do Projeto

| **Sprint** |                              **Produto (Entrega)**                             | **Data Início** | **Data Fim** | **Entregável** |             **Responsáveis**            | **% Conclusão** |
|:----------:|:------------------------------------------------------------------------------:|:---------------:|:------------:|:--------------:|:---------------------------------------:|:---------------:|
|  Sprint 0  |                         Direcionamento geral do produto                        |    11/04/2025   |  15/04/2025  |                |                                         |                 |
|  Sprint 1  |                   Início do documento de visão (1.1 até 2.1)                   |    16/04/2025   |  22/04/2025  |                |               João Gabriel              |       20%       |
|  Sprint 2  |                                Começo do backlog                               |    23/04/2025   |  02/05/2025  |                |        João Pedro e Lucas Andrade       |       35%       |
|  Sprint 3  |                                Terminar backlog                                |    02/04/2025   |  09/05/2025  |                |           João Gabriel, Robson          |                 |
|  Sprint 4  | Fazer as correções sugeridas no Doc. de Visão e mudar o backlog baseado nelas. |    12/05/2025   |  16/05/2025  |                | João Gabriel João Pedro e Lucas Andrade |                 |
|  Sprint 5  |                   Sprint final para completar o doc. de Visão                  |    17/05/2025   |  21/05/2025  |                |                  Todos                  |       100%      |

## Matriz de Comunicação

|                                   **Descrição**                                  |     **Área/Envolvidos**    | **Periodicidade** |                 **Produtos Gerados**                |
|:--------------------------------------------------------------------------------:|:--------------------------:|:-----------------:|:---------------------------------------------------:|
| Organização das próximas sprints e acompanhamento geral do progresso dos membros |      Equipe do Projeto     |      Semanal      | Atas de reunião, relatórios da situação do projeto. |
|             Avaliação do progresso da equipe no projeto pelo Monitor.            | Equipe do Projeto, Monitor |     Quinzenal     | Atas de reunião, relatórios da situação do projeto. |

## Gerenciamento de Riscos

O gerenciamento de riscos do projeto tem como objetivo ajudar a equipe a se preparar para possíveis problemas que possam atrapalhar o andamento do desenvolvimento, como atrasos, bugs ou dificuldades técnicas. A tabela a seguir mostra os principais riscos que identificamos até o momento, junto com o nível de impacto de cada um, o que podemos fazer para evitar que eles aconteçam (mitigação) e como agir caso eles realmente ocorram (plano de contingência). Com isso, conseguimos nos organizar melhor e garantir que o projeto continue avançando, mesmo diante de imprevistos.

|                                         **Risco**                                        | **Grau de Exposição** |                                          **Mitigação**                                         |                             **Plano de Contingência**                            |
|:----------------------------------------------------------------------------------------:|:---------------------:|:----------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|
|         Alterações frequentes no escopo ou requisitos após o início das sprints.         |          Alto         |    Manter backlog atualizado e registrar todas mudanças de escopo em reunião com o cliente.    |    Reorganizar as tarefas da sprint priorizando as funcionalidades essenciais.   |
|        Dificuldade técnica com as tecnologias utilizadas (Django, React, Docker).        |         Médio         | Realizar sessões de estudo em grupo, uso de tutoriais, pair programming e apoio dos monitores. | Substituir por soluções tecnológicas mais conhecidas pela equipe, se necessário. |
|          Baixo engajamento ou ausência de membros da equipe durante as sprints.          |         Médio         |       Definir responsabilidades individuais e revisar compromissos em reuniões semanais.       |      Redistribuir tarefas e reforçar a comunicação com os membros ausentes.      |
| Integração com o banco de dados falhando (Ex: perda de conexão ou dados inconsistentes). |          Alto         |                 Usar scripts de teste e fazer testes de integração frequentes.                 |                Utilizar backups e manter dumps regulares do banco.               |
|     Bugs em funcionalidades críticas como controle de validade ou alerta de estoque.     |          Alto         |         Realizar testes unitários e de sistema contínuos para funcionalidades críticas.        |        Corrigir o bug imediatamente, priorizando entrega funcional mínima.       |
|                   Falta de comunicação clara entre os membros do time.                   |          Alto         |                             Usar canais oficiais (WhatsApp/Discord)                            |                     Agendar reuniões extras para alinhamento.                    |
|           Falha de usabilidade ou confusão por parte do cliente durante testes.          |         Médio         |              Realizar testes manuais com foco em usabilidade e escutar feedbacks.              |        Ajustar o layout e comportamento com base no feedback rapidamente.        |
|          Dificuldade em manter o ritmo nas fases finais (cansaço ou sobrecarga).         |         Médio         |                 Criar cronogramas realistas e manter sprints curtas e focadas.                 |     Reduzir o escopo e cortar funcionalidades "Should e Could" se necessário.    |

## Critérios de Replanejamento

|                                **Risco**                                |                                                  **Critério de Replanejamento**                                                  |                                                **Ação em Caso de Replanejamento**                                                |
|:-----------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------:|
| Atraso nas entregas de funcionalidades devido a mudanças de requisitos. |                             Atraso acumulado superior a 1 sprint em relação ao cronograma planejado.                             |                                          Repriorizar funcionalidades e ajustar o backlog                                         |
|            Falta de comunicação entre os membros do projeto.            |                                      Um membro não responder a contatos por grandes períodos                                     |         Delegar suas tarefas a outro membro e anotar a sua ausência na documentação de funções e  para avaliação depois.         |
|                         Conflitos de integração                         | Conflitos de integração que afetem funcionalidades principais ou requisitos de prioridade alta, comprometendo entregas críticas. | Alocar mais tempo para testes de integração e refatorar módulos críticos para garantir a funcionalidade essencial do aplicativo. |
|             Perda de dados durante a importação de planilhas            |                           Identificação de quaisquer perdas de dados durante a importação de planilhas                           |             Replanejar e refatorar o fluxo de importação e, em um caso crítico, modificar a estratégia de importação.            |
|             Necessidade de mudar significativamente o escopo            |                                Funcionalidade Must não sendo cumpridas conforme o prazo da sprint.                               |               Replanejar as funcionalidades should/could que seriam trabalhadas em sprints futuras e substituí-las               |
