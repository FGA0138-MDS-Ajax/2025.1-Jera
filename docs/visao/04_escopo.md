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

### 4.3 Cenários

A tabela de cenários funcionais organiza exemplos práticos de como os usuários interagem com o sistema, conectando requisitos a situações reais de uso. Ela orienta o desenvolvimento das funcionalidades e evita desvios do escopo. Alguns itens não possuem sprint definida, pois foram deixados para planejamentos futuros, reduzindo expectativas irreais. A tabela seguinte apresenta esses cenários, com ator, contexto, passos e resultado esperado:


<div align="center">Tabela : Cenários funcionais</div>

| Nº  | Ator                     | Contexto                                                                 | Passos                                                                                         | Resultado Esperado                                                  | Sprint |
|------|-------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|--------|
| 1    | Administrador           | Deseja registrar uma nova flor para manter o controle de estoque.       | Acessar "Cadastro de Flores", preencher nome, validade e lote, e salvar.                       | Flor cadastrada com todos os dados, disponível para consulta.       | 7      |
| 2    | Operador                | Deseja registrar a saída de flores por venda ou consumo.                | Acessar "Registrar Saída", selecionar flor, informar quantidade e motivo, e salvar.            | Estoque atualizado com o motivo registrado.                         | 7      |
| 3    | Operador                | Deseja registrar flores recém-chegadas para avaliação futura.           | Acessar "Registrar Flores", preencher dados básicos e salvar.                                  | Flores registradas para futura avaliação e quantificação.           | 7      |
| 4    | Administrador           | Deseja configurar níveis mínimos e máximos de estoque por flor.         | Acessar "Configurar Estoque", selecionar flor, definir níveis e salvar.                        | Alertas automáticos conforme os níveis definidos.                   | 8      |
| 5    | Gerente                 | Deseja visualizar indicadores de validade e estoque em um painel.       | Acessar "Dashboard" e visualizar gráficos e relatórios.                                        | Indicadores acessíveis para tomada de decisão estratégica.          | X      |
| 6    | Gerente / Operador      | Deseja localizar rapidamente produtos no estoque.                      | Acessar "Consulta Rápida", pesquisar por nome, tipo, validade ou quantidade.                   | Exibição de informações como validade, estoque e lote.              | 8      |
| 7    | Gerente / Operador      | Deseja receber alertas sobre produtos com baixo giro.                   | Verificar alertas no painel de indicadores.                                                    | Produtos parados identificados e exibidos como alerta.              | 8      |
| 8    | Operador                | Deseja registrar movimentações via QR Code.                             | Acessar "QR Code", escanear o lote e confirmar os dados.                                       | Movimentações registradas com sucesso via QR Code.                  | 9      |
| 9    | Operador                | Deseja visualizar os principais indicadores de estoque em uma só tela.  | Acessar "Dashboard" e verificar métricas como validade e movimentações.                        | Indicadores consolidados e visíveis em um único painel.             | X      |
| 10   | Operador                | Deseja registrar manualmente o estado estético das flores.              | Acessar "Estado Estético", selecionar flor, definir estado e salvar.                           | Estado estético atualizado e alertas para condições críticas gerados.| X      |
| 11   | Administrador           | Deseja cadastrar insumos e materiais de apoio com categorias.           | Acessar “Cadastro de Materiais”, inserir categorias e atributos, e salvar.                     | Materiais registrados no sistema com organização por categoria.     | X      |
| 12   | Gerente                 | Deseja exportar relatórios para reuniões e análise externa.             | Acessar “Relatórios”, selecionar período e tipo de dados, e exportar.                          | Relatórios exportados em PDF/Excel.                                 | X      |
| 13   | Administrador           | Deseja consultar o histórico de movimentações por item.                 | Acessar “Histórico de Item”, selecionar flor e visualizar movimentações registradas.           | Histórico completo exibido para análise.                            | X      |
| 14   | Gerente                 | Deseja receber alertas visuais sobre validade e estoque.                | Verificar notificações no topo da tela durante o uso do sistema.                               | Alertas visuais exibidos automaticamente no sistema.                | X      |
| 15   | Operador / Administrador| Deseja registrar motivos das perdas de flores.                          | Acessar “Relatório de Perdas”, preencher motivo e salvar.                                      | Registro salvo com o motivo da perda e disponível para análise.     | X      |


## Tabela de Backlog do Produto

### Backlog de Requisitos

## Backlog de Débitos Técnicos

## Backlog de Documentação

## Backlog de Suporte/Processo

## Backlog de Testes
