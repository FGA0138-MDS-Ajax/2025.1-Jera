# Testes de Software

## Estratégia de testes

### Níveis de testes abordados

Para garantir a confiabilidade do sistema AgroStock, serão realizados testes em três níveis distintos:

- **Testes Unitários:** serão aplicados diretamente nas funções e componentes isolados, principalmente no backend, como validação de lógica de cálculo de validade de flores, verificação de campos obrigatórios e manipulação de dados. Esses testes asseguram que cada bloco individual de código se comporta conforme esperado.

- **Testes de Integração:** serão utilizados para validar o funcionamento conjunto entre diferentes módulos, como a comunicação entre o frontend e o backend durante o cadastro, atualização e visualização de produtos no estoque. O objetivo é garantir que os fluxos de dados entre os componentes estejam corretos.

- **Testes Manuais:** envolvem a simulação de ações completas feitas por um usuário final, como o cadastro de um novo produto, visualização de alertas de validade, geração de relatórios e navegação pelas telas. Esses testes permitem avaliar o comportamento do sistema como um todo, de ponta a ponta e serão feitos por integrantes do grupo.

Essa abordagem por camadas garante que tanto o núcleo da aplicação quanto suas interfaces e integrações estejam bem validadas ao longo do desenvolvimento.

### Tipos de testes abordados

A estratégia adotada contempla tanto testes funcionais quanto testes não funcionais, conforme a natureza das funcionalidades testadas:

- **Testes Funcionais:** são o foco principal e têm o objetivo de verificar se os requisitos levantados foram corretamente implementados. Isso inclui funcionalidades como: cadastro de flores e insumos, alertas de validade, geração de relatórios e controle de movimentações de estoque. Esses testes serão baseados diretamente nas user stories e requisitos do backlog.

Essa variedade de testes garante não apenas que o sistema funcione, mas que ofereça uma boa experiência ao usuário.

### Ambientes de testes usados

Para garantir segurança, controle e fidelidade ao uso real, os testes serão executados em ambientes distintos, conforme o tipo de teste:

- **Ambiente de Desenvolvimento (Local):** utilizado para testes unitários e experimentações rápidas durante a codificação. Executado localmente pelos desenvolvedores, com simulação de dados.

- **Ambiente de Homologação:** será configurado para execução dos testes de integração e sistema. Esse ambiente simula as condições reais de uso (com banco de dados, autenticação e APIs funcionando) e é acessível a todos os membros da equipe. Ele permite validar a aplicação sem comprometer o ambiente de produção e será com a ferramenta Postman, com dados fictícios para simulação e validação das operações.

- **Ambiente de Produção:** não será utilizado para execução de testes, evitando riscos para os usuários finais e os dados reais do sistema.

O uso de ambientes separados garante segurança, organização dos testes e uma base confiável para tomadas de decisão ao longo do projeto.

### Formas de análise dos testes propostos

A análise dos testes será conduzida com base em critérios objetivos e evidências coletadas durante a execução de cada caso de teste. Os principais métodos adotados incluem:

- **Critérios de Aceitação:** cada caso de teste terá um resultado esperado claramente definido, com base nos requisitos do sistema. Um teste será considerado "aprovado" apenas se o comportamento observado for igual ao esperado.

- **Registros de Evidência:** serão coletadas evidências visuais (como capturas de tela) e registros de log (quando aplicável) para cada execução, especialmente nos testes manuais.

- **Documentação de Falhas e Correções:** eventuais erros encontrados durante os testes serão documentados junto com suas respectivas soluções, permitindo rastreabilidade e aprendizado contínuo da equipe.

- **Métricas de Execução:** sempre que possível, serão registradas métricas como número total de testes executados, porcentagem de sucesso, tempo médio de execução e número de ciclos necessários até a aprovação.

Essa abordagem garante que a validação do sistema seja feita de forma controlada, transparente e com dados concretos que justifiquem as decisões tomadas no processo de desenvolvimento.

## Roteiro de teste

Para minimizar os riscos no ambiente de teste e preservar a integridade do projeto, todos os testes planejados serão realizados em uma branch dedicada. Essa estratégia garante que possíveis erros ou modificações durante os testes não impactem o código principal do projeto.

**Pré-condição para testes:** fica determinado fazer na ordem dos códigos, assim, tudo estará pronto para o próximo passo.

### Testes Unitários

- **TU1.1 – Cadastro das Flores**
      - **Descrição:** Verifica se o serviço cadastra as flores corretamente.
      - **Esperado:** Cadastrar uma nova flor.
      - **Definição de Aceito:** A flor deve entrar no sistema.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TU1.2 – Exclusão das Flores**
      - **Descrição:** Verifica se o serviço exclui as flores corretamente.
      - **Esperado:** Excluir uma flor existente.
      - **Definição de Aceito:** A flor deve ser excluída do sistema.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TU2 – Consulta Rápida de Produtos**
      - **Descrição:** Pesquisar produtos pelo nome, tipo, validade ou quantidade.
      - **Esperado:** Pesquisar e encontrar o produto.
      - **Definição de Aceito:** Receber a busca pela flor corretamente.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

### Testes Integrados

- **TI1.1 – Registro de Entrada no Estoque**
      - **Descrição:** Registrar entrada no estoque com data, quantidade, motivo e responsável.
      - **Esperado:** Adicionar a flor no estoque.
      - **Definição de Aceito:** A flor deve entrar no estoque.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TI1.2 – Registro de Saída no Estoque**
      - **Descrição:** Registrar saída no estoque com data, quantidade, motivo e responsável.
      - **Esperado:** Tirar uma flor do estoque.
      - **Definição de Aceito:** A flor deve sair do estoque.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TI2.1 – Controle de Validade e Lote**
      - **Descrição:** Associar data de validade ao produto e enviar alerta quando próximo do vencimento.
      - **Esperado:** Enviar a notificação.
      - **Definição de Aceito:** Deve haver um sinal de que a notificação foi enviada.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TI2.2 – Notificação de Validade**
      - **Descrição:** Receber o alerta da data de vencimento quando ativada.
      - **Esperado:** Receber a notificação.
      - **Definição de Aceito:** A notificação deve ser recebida.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TI3 – Estoque Mínimo e Máximo**
      - **Descrição:** Definir faixas de estoque por item.
      - **Esperado:** Limitar a quantidade de um item.
      - **Definição de Aceito:** Não deixar ultrapassar a quantidade máxima definida para flores.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TI4 – Alerta de Produtos com Baixo Giro**
      - **Descrição:** Listar produtos parados no estoque por muito tempo.
      - **Esperado:** Identificar os produtos parados.
      - **Definição de Aceito:** Gerar uma lista de produtos com baixo giro.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

### Testes Manuais

- **TM1 – Leitura de QR Code**
      - **Descrição:** Permitir a leitura de QR Code para identificar produtos e lotes.
      - **Esperado:** O QR Code deve funcionar corretamente.
      - **Definição de Aceito:** O sistema deve direcionar corretamente após a leitura do QR Code.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.

- **TM2 – Registros Incompletos**
      - **Descrição:** Tentar registrar de maneira incompleta uma flor ou um usuário.
      - **Esperado:** O sistema negar o registro.
      - **Definição de Aceito:** Dar erro e voltar uma mensagem de erro de maneira adequada.
      - **Registros ao Fazer o Teste:** (Espaço para preencher)
      - **Reparos Feitos:** (Espaço para preencher)
      - **Status do Teste:** A começar.
