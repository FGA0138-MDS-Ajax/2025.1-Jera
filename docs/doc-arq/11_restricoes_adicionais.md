## Restrições adicionais

Esta seção descreve restrições adicionais ao **FloraGest**, que influenciam seu design e desenvolvimento, complementando as metas e restrições arquiteturais definidas anteriormente. Essas restrições adicionais estão relacionadas a aspectos negociais e características de qualidade de software, importantes para o sucesso do produto e a satisfação do usuário.

O **FloraGest** é projetado para ser uma plataforma de gestão de estoque acessível e intuitiva, voltada para pequenas e médias floriculturas. Isso implica que:

- O sistema será acessível diretamente pela internet, exigindo login e identificação do usuário para garantir a segurança e a integridade dos dados. Isso permite que os usuários acessem a plataforma de qualquer local com conexão à internet, adequando-se à realidade de negócios que podem ter diferentes pontos de operação ou proprietários que gerenciam remotamente.
  
- A interface será acessível, intuitiva e adaptada à realidade desses negócios, visando um público-alvo que, em sua maioria, possui pouca familiaridade com tecnologias avançadas. Isso restringe a complexidade da interface e exige uma alta usabilidade.

### Características de Qualidade e Restrições Arquiteturais

As seguintes características de qualidade são importantes para o **FloraGest** e impõem restrições e metas arquiteturais:

- **Usabilidade**:  
  O sistema é destinado a floristas e empresários que podem ter pouca familiaridade com tecnologias mais avançadas.  
  A interface deve ser simples e intuitiva, permitindo o registro e controle digital de forma fácil.  
  O design da interface deve priorizar a simplicidade, minimizando a curva de aprendizado.  
  Essa usabilidade é importante para evitar o uso de planilhas ou controles manuais, que geram desperdícios.

- **Confiabilidade**:  
  Deve haver controle de produtos perecíveis e dados financeiros.  
  Falhas em funcionalidades críticas como controle de validade ou alerta de estoque podem gerar perdas, rupturas de estoque e baixa previsibilidade.  
  O sistema deve garantir que os alertas de estoque mínimo/máximo estejam corretos e que os dados sejam consistentes.  
  Deve haver mecanismos para usar scripts de teste e fazer testes de integração frequentes, além de utilizar backups e manter *dumps* regulares do banco para proteção contra perda de dados.  
  Bugs em funcionalidades críticas devem ser corrigidos imediatamente.  
  A confiabilidade está diretamente ligada à redução de perdas e à tomada de decisão para o negócio.

- **Desempenho**:  
  A necessidade de controle rigoroso de entradas, saídas e validade dos produtos em tempo real impõe requisitos de desempenho.  
  - O tempo médio para registrar entradas/saídas deve ser de no máximo **1 minuto**.  
  - O tempo para exportar relatórios deve ser de no máximo **10 segundos**.  
  Esse desempenho deve garantir que o sistema suporte o ritmo do negócio e forneça informações atualizadas para decisões rápidas.

- **Manutenibilidade**:  
  Considerando a inexperiência da maioria dos integrantes do grupo no desenvolvimento de softwares, a manutenibilidade é importante para permitir a evolução contínua do sistema e a correção de possíveis erros.  
  Para tal, as tecnologias escolhidas (Python com FastAPI e React, por exemplo) promovem a escrita de código limpo e modular.  
  Além disso, práticas como *code review* e testes contínuos devem ser seguidas.

- **Escalabilidade**:  
  Por mais que o **FloraGest** esteja focado em pequenas e médias floriculturas, ele deve ser escalável para adaptar-se às demandas reais do setor.  
  Sabendo que a plataforma deve acomodar as principais demandas dos usuários, as escolhas das tecnologias devem suportar a capacidade de escalar o sistema.  
  Essa escalabilidade permite que o **FloraGest** cresça junto com os negócios dos floristas, comportando o crescimento do número de usuários ou volume de dados.

---

Essas restrições e características de qualidade guiarão as decisões de design e implementação, assegurando que o **FloraGest** não apenas funcione, mas opere de forma eficaz, segura e adaptável às necessidades do cliente.