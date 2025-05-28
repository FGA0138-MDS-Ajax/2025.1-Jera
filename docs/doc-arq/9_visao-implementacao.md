## Diagrama de Pacotes

<div align="center">

  <img src="diagrama_de_pacotes.png" alt="Diagrama de Pacotes - FloraGest" width="300"/>

  <p><strong>Figura</strong> – Diagrama de Casos de Uso – FloraGest<br>
  <strong>Fonte</strong>: Elaboração Própria (2025)</p>

</div>

---

O diagrama nos apresenta as principais camadas da arquitetura do **FloraGest**, sendo elas:

### 🔷 Camada de Apresentação
- Contém a **interface de usuário**, responsável pela interação do usuário com o sistema.
- Inclui também a **lógica de apresentação**, que capta e transforma os dados para o sistema.

### 🔷 Camada de Lógica de Negócio
- Abriga as **regras de serviço** que controlam e estipulam o funcionamento do sistema.
- Compreende também a **API** (FastAPI) e a **ORM** (SQLAlchemy), que fazem a mediação entre a apresentação e os dados.

### 🔷 Camada de Dados
- Responsável pelo **banco de dados** (MySQL), onde são armazenadas as informações do sistema.
