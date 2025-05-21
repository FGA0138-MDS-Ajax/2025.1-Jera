# Testes de Software

## Estratégia de testes

### Níveis de testes abordados

### Tipos de testes abordados

### Ambientes de testes usados

### Formas de análise dos testes propostos

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
