## Metas e Restrições Arquiteturais

### Desempenho e Resposta do Sistema

O desempenho é um aspecto fundamental para garantir a usabilidade e a aceitação de um sistema móvel. Para isso, estabelecemos como meta que o sistema deve responder a **95% das consultas em até 2 segundos** após a solicitação do usuário. Um tempo de resposta rápido é essencial para proporcionar uma experiência de usuário fluida, especialmente em um aplicativo que será utilizado em ambiente fechado, onde o tempo e a eficiência são críticos. Isso não apenas melhora a satisfação dos usuários, mas também incentiva o uso contínuo da plataforma.

Como parte das restrições arquitetônicas, a escolha do banco de dados recaiu sobre o **mySQL**, devido à sua robustez, escalabilidade e suporte às otimizações para alta performance. Além disso, sua compatibilidade permite uma integração eficiente com a estrutura do backend, garantindo uma recuperação e armazenamento de dados confiáveis e de baixa latência. Essas decisões foram tomadas para sustentar o tempo de resposta esperado e manter a estabilidade do sistema, mesmo em cenários de alta demanda.

### Padrões e Tecnologias

Para garantir a consistência e a facilidade de integração, o sistema seguirá o padrão **GraphQL** para APIs. GraphQL é uma linguagem de consulta e manipulação de dados para APIs, e também um ambiente de tempo de execução no servidor para atender a essas consultas com seus dados existentes. Pense nele como uma forma mais eficiente e flexível de pedir informações de um servidor, em comparação com as APIs tradicionais (como REST).

No backend, feito com **Python (FastAPI)**, uma escolha motivada por sua estrutura altamente modular e suporte a boas práticas arquitetônicas. O Python se destaca por sua sintaxe limpa, legibilidade de código e ampla comunidade, além de oferecer uma vasta gama de bibliotecas que agilizam o desenvolvimento e garantem robustez ao projeto.

O **FastAPI**, por sua vez, foi escolhido por ser um dos frameworks mais modernos e eficientes para desenvolvimento de APIs em Python. Ele oferece alta performance, comparável a frameworks como Node.js e Go, graças ao uso assíncrono, que proporciona validação automática de dados, tipagem forte e geração automática de documentação interativa.

### Interface do Usuário

No frontend, a experiência do usuário será priorizada por meio de uma interface responsiva e acessível, desenvolvida com **React**. A escolha dessa tecnologia permite construir aplicações móveis nativas para Android de forma eficiente, preservando a simplicidade e a intuitividade necessárias para o público-alvo, que, em sua maioria, possui pouca familiaridade com tecnologias mais avançadas.

Com essas diretrizes e restrições bem definidas, o projeto busca equilibrar desempenho, usabilidade e escalabilidade, garantindo que o sistema atenda às necessidades dos usuários e mantenha uma base sólida para futuras melhorias.