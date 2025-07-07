# Métricas e Medições

# GQM relacionado ao desenvolvimento do projeto

O Goal Question Metric (GQM) foi elaborado para alinhar as métricas do projeto ao seu objetivo principal: desenvolver uma plataforma de gestão de estoque acessível para floristas, de forma a garantir qualidade, prazo, usabilidade e valor para o negócio.

As métricas foram definidas com base em:
1.	Requisitos do Backlog: Funcionalidades críticas (ex: alertas de estoque e registro de movimentações) e processos (como documentação e dívidas técnicas);
2.	Expectativas dos Stakeholders: Entrega de testes intermediários e produto funcional.
3.	Riscos do projeto: Comunicação da equipe, cumprimento de prazos e qualidade do código.

As métricas estão organizadas em objetivos mensuráveis, com perguntas e formas de análise, o que permite monitorar tanto os aspectos técnicos, como bugs e velocidade, quanto de negócio, como redução de perdas e uso de dashboard.

As tabelas abaixo, sintetizam esse planejamento, conectando métricas às necessidades reais do projeto. 

### GQM - Dívidas Técnicas, Documentação, Testes e Processos de Suporte

| Objetivo                     | Perguntas                                                             | Métricas                     | Definição/Cálculo                                               | Escala     | Valor Esperado          | Forma de Análise                                     |
|-----------------------------|-----------------------------------------------------------------------|------------------------------|------------------------------------------------------------------|------------|--------------------------|------------------------------------------------------|
| 1. Entregar funcionalidades prioritárias | Quantos "Musts" foram concluídos por sprint?                     | Taxa de entrega de Musts     | (Musts concluídos / Musts planejados) × 100                     | %          | 100%                    | Priorizar dívidas técnicas (DT01, DT02) se < 100%    |
| 2. Garantir qualidade do código         | Quantos bugs são reportados por sprint?                          | Densidade de bugs            | Nº de bugs / Nº de tarefas concluídas                          | Número     | ≤ 0.2 bug/tarefa        | Revisar testes de unidade (T01) e refatoração (DT03) |
| 3. Controlar dívidas técnicas           | Qual o % de dívidas técnicas resolvidas?                         | Taxa de resolução de DT      | (DTs resolvidas / Total de DTs) × 100                           | %          | ≥ 30% por sprint        | Alocar tempo fixo por sprint para DTs                |
| 4. Validar usabilidade                  | O tempo para exportar relatórios (1.10) é aceitável?             | Tempo médio de exportação    | Cronometrar tempo de geração de PDF/Excel                      | Segundos   | ≤ 10s                   | Otimizar consultas ou usar cache                     |
| 5. Eficiência em documentação           | A documentação (DO01-DO05) está atualizada?                      | % de docs entregues          | (Docs concluídos / Total de docs) × 100                        | %          | 100% antes do MVP       | Incluir revisão nas Definition of Done              |
| 6. Efetividade de alertas              | Os alertas visuais (1.12) são acionados corretamente?            | Taxa de falsos positivos     | (Alertas incorretos / Total de alertas) × 100                 | %          | ≤ 5%                    | Melhorar regras de negócio para validade (1.3)       |
| 7. Saúde do processo                   | As revisões (S03) estão sendo eficazes?                          | % de issues identificadas    | (Issues encontradas em revisões / Total de issues) × 100       | %          | ≥ 70%                   | Aumentar frequência se < 70%                         |




## GQM relacionado à Gestão de Estoque

Para assegurar que o sistema atenda seu objetivo principal, uma gestão de estoque eficiente para floristas, foram definidas métricas específicas que avaliam a efetividade, precisão e impacto prático das funcionalidades – chave.

Essas métricas focam em:
1.	Controle operacional: tempo e precisão nas movimentações de estoque (entradas/saídas);
2.	Prevenção de Perdas: Alertas de validade e estoque mínimo, além de relatórios de perdas;
3.	Tomada de Decisão: uso do dashboard e histórico para ações estratégicas.

As métricas definidas abaixo quantificam o desempenho do sistema na rotina dos usuários, garantindo que as features não apenas funcionem, mas gerem valor real. Valores fora do esperado indicam oportunidades de melhoria direta no produto.
### GQM de Gestão de Estoque

| Objetivo                         | Perguntas                                                             | Métricas                   | Definição/Cálculo                                                                 | Valor Esperado |
|----------------------------------|-----------------------------------------------------------------------|----------------------------|------------------------------------------------------------------------------------|----------------|
| Garantir precisão no controle de estoque | Os alertas de estoque mínimo/máximo (1.4) estão corretos?            | Taxa de acerto de alertas | (Alertas corretos / Total de alertas) × 100                                      | ≥ 95%          |
| Otimizar registro de movimentações      | O tempo para registrar entradas/saídas (1.2) é aceitável?            | Tempo médio por registro  | Cronometrar desde a abertura até a confirmação                                   | ≤ 1 minuto     |
| Reduzir perdas                          | O sistema está ajudando a minimizar perdas (1.14)?                   | % de redução de perdas     | (Itens rastreados no momento que passam de ótimo pra regular / Total rastreados) × 100 | ≥ 80%          |

