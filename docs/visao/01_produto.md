# Visão Geral do Produto

## Problema

### Contexto

A gestão eficiente de estoques é um dos pilares fundamentais para a sustentabilidade econômica de negócios que lidam com produtos perecíveis. No setor agrícola, especialmente na floricultura, esse desafio é ainda mais crítico devido à natureza perecível das flores, que exigem condições específicas de armazenamento, transporte e comercialização para manter sua qualidade e valor de mercado (FAO,2021). Entretanto, a realidade de muitas floriculturas de pequeno e médio porte no Brasil ainda é marcada pelo uso de planilhas manuais e pouco adaptadas, que pode influenciar no desperdício de insumos, ruptura de estoque, ineficiência operacional, dentre outros.

De acordo com estudos realizados pela IBRAFLOR, Instituto Brasileiro de Floricultura, cerca de 30% das flores são perdidas devido a falha no controle de validade e condições inadequadas de armazenamento (IBRAFLOR, 2022). Ainda, a falta de sincronia entre demanda e reposição leva a perdas financeiras e insatisfação do cliente (SEBRAE, 2022) e processos manuais consomem tempo e aumentam a margem de erro, impactando diretamente e negativamente a produtividade (EMBRAPA, 2023).

Diante desse cenário, a implementação de uma solução tecnológica especializada surge como uma alternativa viável para otimizar a gestão de estoques nesse segmento. A proposta do projeto, portanto, é desenvolver uma plataforma de gestão integrada, com foco na automação, buscando redução de erros humanos e ganho de eficiência; facilidade de uso e acessibilidade, criando uma interface intuitiva para pequenos e médios produtores; monitoramento em tempo real e gestão de volumes, com o objetivo de buscar o controle preciso de validade e níveis de estoque. 

Este projeto está acordado com a ODS 8.2, estabelecido pela Organização das Nações Unidas (ONU, 2015), que prevê:
      "Alcançar níveis mais elevados de produtividade econômica por meio da diversificação, modernização tecnológica e inovação, com foco em setores de alto valor         agregado e intensivos em mão de obra.”

Enquanto soluções genéricas de gestão podem não atender às particularidades da floricultura, este projeto busca desenvolver uma plataforma sob medida, que contribui diretamente para o aumento da produtividade, inclusão tecnológica e sustentabilidade ambiental.


### Problema Encontrado

Um florista começando seu negócio precisa pensar em como irá fazer o armazenamento e cuidado das flores, sendo essa uma parte chave do empreendimento. Porém, por falta de opções no mercado de aplicações que escalam com altos volumes de maneira organizada de uma floricultura e não apenas níveis domésticos de cuidado; que não facilitam o registro dessas flores para acomodar esse alto volume e para pessoas leigas em tecnologia; que não oferecem estatísticas e avisos com o fim de ajudar na gestão.

Dessa maneira, não existem alternativas no mercado que fazem o casamento de empresários e floristas que estão começando agora seu negócio e precisam de uma solução de gestão que acomode quaisquer demandas que usuários desse nicho poderiam ter, sem precisar depender de soluções mais ineficientes e com maior margem para erros, como as manuais.

### Solução e Proposta

Desenvolver uma plataforma de gestão de estoque moderna, voltada para pequenos floristas que querem começar seu negócio ou médios empresários com necessidade de manejar melhor sua organização de tamanho já considerável. A ferramenta será acessível, intuitiva e adaptada à realidade desses negócios, permitindo o registro e controle digital de entradas e saídas de produtos, alertas de estoque, análises de desempenho e suporte à tomada de decisão com base em dados.

O projeto será totalmente alinhado aos **Objetivos de Desenvolvimento Sustentável (ODS)** propostos pela ONU, especialmente o de número **8.2**, além de um objetivo secundário de democratizar o uso de tecnologias para a população, que também está previsto em outros objetivos da ODS.

## Declaração de Posição do Produto

- **Para:** Pequenas e médias empresas do setor floriculturista.  
- **Necessidade:** Modernizar e automatizar a gestão de estoque e produção, reduzindo perdas e aumentando a produtividade.  
- **O produto:** **FloraGest**  
- **Que:** Oferece uma interface simples para registrar, monitorar e analisar o estoque e movimentações, com alertas inteligentes e relatórios analíticos, como gráficos.  
- **Ao contrário:** De ferramentas ineficientes, não escaláveis e geralmente lentas que geram problemas na gestão.  
- **Nosso produto:** Foca na parte empreendedora do cuidado de flores, com várias ferramentas visuais e facilitadoras auxiliando esse propósito, sendo isso algo não existente em outros aplicativos do mercado voltados a esse setor.

## Objetivos do Produto

### Objetivo Principal

Desenvolver uma plataforma digital de gestão de estoque voltada para floriculturas de pequeno e médio porte, com foco em acessibilidade, automação e eficiência, tirando limitações enfrentadas por esses empreendimentos, que muitas vezes recorrem a controles manuais ou planilhas ineficientes, resultando em perdas, rupturas de estoque e baixa previsibilidade.

Isso é ainda mais crítico considerando a natureza altamente perecível das flores e a exigência por manutenção estética constante, dessa forma, precisará de um controle rigoroso de entradas, saídas e validade dos produtos em tempo real.

A plataforma proporcionará alertas inteligentes e relatórios analíticos, tudo isso com o objetivo de preencher uma lacuna no mercado, oferecendo uma solução especializada e escalável, adaptada às demandas reais do setor floriculturista, que também se alinha aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU, especialmente o de número **8.2**, promovendo a modernização de processos produtivos.

### Objetivos Secundários

- Promover a democratização no uso de ferramentas mais robustas para empreendedores de menor porte.
- Gerar relatórios e dashboards em tempo real para tomada de decisão.
- Controlar o estoque de outros recursos típicos de uma floricultura.

## Tecnologias a Serem Utilizadas

- **Frontend:** React
- **Backend:** Python
- **Banco de Dados:** MySQL
- **Frameworks/Bibliotecas:** React (frontend), FastAPI (backend), GraphQL, qrcode, SQLAlchemy
- **Ferramentas adicionais:** GitHub, GitHub Pages, GitHub Actions, Figma (para prototipagem), Postman (testes de API), Docker (caso necessário para deploy), Google Docs, VSCode, AWS
- **Hospedagem:** Heroku, Render ou plataforma similar
