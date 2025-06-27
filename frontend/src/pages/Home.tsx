import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "../assets/Minimalist_and_moder.png";

/* sequência fixa de cores */
const colors = ["#008000", "#E2725B", "#FFFDD0"];

/* textos dos benefícios */
const features = [
  "Alertas automáticos de baixo estoque",
  "Notificações de validade próxima de flores e insumos",
  "Insights sobre queda de vendas por espécie",
  "Perfis de usuário (Atendente, Gerente, Administrador)",
  "Relatórios em tempo real para decisões rápidas",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* NAVBAR FIXA */}
      <header className="home-navbar">
        <div className="navbar-brand">FloraGest</div>
        <div className="navbar-buttons">
          <button onClick={() => navigate("/register")}>
            Experimente grátis
          </button>
          <button onClick={() => navigate("/login")}>Já sou cliente</button>
        </div>
      </header>

      {/* HERO (continua antes dos blocos de tela inteira) */}
      <section className="hero-full">
        <img src={logo} alt="Logo" className="hero-logo" />
        <h1>FloraGest</h1>
        <p className="hero-text">
          Gerencie seu estoque de flores, reduza desperdícios e receba alertas
          inteligentes em tempo real.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate("/register")}>
            Experimente grátis
          </button>
          <button onClick={() => navigate("/cadastro")} className="login-btn">
            Já sou cliente
          </button>
        </div>
      </section>

      {/* BLOCOS DE TELA INTEIRA */}
      {features.map((text, i) => {
        const bg = colors[i % colors.length];
        const dark = bg.toLowerCase() === "#fffdd0";
        return (
          <section
            key={i}
            className="feature-full"
            style={{ backgroundColor: bg }}
          >
            <img src={logo} alt="Ícone" className="feature-img" />
            <h2 className={dark ? "dark-text" : ""}>{text}</h2>
          </section>
        );
      })}
    </div>
  );
}
