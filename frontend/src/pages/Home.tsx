import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "../assets/Minimalist_and_moder.png";
import estoque from "../assets/EstoqueHome.png";
import sino from "../assets/SinoHome.png";
import graficos from "../assets/GráficosHome.png";
import equipe from "../assets/EquipeHome.png";
import lupa from "../assets/LupaHome.png";
import crescer from "../assets/CrescerHome.png";

const colors = ["#008000", "#E2725B", "#FFFDD0"];
const images = [estoque, sino, graficos, equipe, lupa, crescer];
const features = [
  "Gerencie todo o seu estoque de flores e insumos!",
  "Ajuste seu estoque com alertas inteligentes!",
  "Relatórios e dados em tempo real para decisões rápidas!",
  "Quantidade funcionários ilimitado com diversos cargos e permissões!",
  "Tenha um controle maior sobre o estado estético de suas flores!",
  "Veja seu negócio crescer com a FloraGest!",
];

const isLightColor = (hex: string): boolean => {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-navbar">
        <div className="navbar-brand">FloraGest</div>
        <div className="navbar-buttons">
          <button onClick={() => navigate("/register")}>
            Experimente grátis
          </button>
          <button onClick={() => navigate("/login")}>Já sou cliente</button>
        </div>
      </header>

      <section className="hero-full">
        <img src={logo} alt="Logo" className="hero-logo" />
        <h1>FloraGest</h1>
        <p className="hero-text">Sua floricultura nunca foi tão eficiente!</p>
        <div className="hero-buttons">
          <button onClick={() => navigate("/register")}>
            Experimente grátis
          </button>
          <button onClick={() => navigate("/login")} className="login-btn">
            Já sou cliente
          </button>
        </div>
      </section>

      {features.map((text, i) => {
        const bg = colors[i % colors.length];
        const dark = isLightColor(bg);
        const imgSrc = images[i % images.length];

        return (
          <section
            key={i}
            className="feature-full"
            style={{ backgroundColor: bg }}
          >
            <img src={imgSrc} alt="Ícone" className="feature-img" />
            <h2 className={dark ? "dark-text" : ""}>{text}</h2>
          </section>
        );
      })}

      <section className="cta-footer">
        <button onClick={() => navigate("/register")}>
          Experimente grátis
        </button>
        <button onClick={() => navigate("/login")} className="login-btn">
          Já sou cliente
        </button>
      </section>
    </div>
  );
}
