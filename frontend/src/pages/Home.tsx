import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "../assets/Minimalist_and_moder.png"; // troque pela sua logo se necessário

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* ---------- HERO ---------- */}
      <header className="home-hero">
        <img src={logo} alt="FloriStock logo" className="home-logo" />

        <h1>FloriStock</h1>
        <p className="home-tagline">
          Gerencie seu estoque de flores, reduza desperdícios e receba alertas
          inteligentes em tempo real.
        </p>

        <div className="home-buttons">
          <button onClick={() => navigate("/register")}>
            Experimente grátis
          </button>
          <button onClick={() => navigate("/login")} className="login-btn">
            Já sou cliente
          </button>
        </div>
      </header>

      {/* ---------- BENEFÍCIOS ---------- */}
      <section className="home-features">
        <h2>Por que usar o FloriStock?</h2>
        <ul>
          <li>🌸 Alertas automáticos de baixo estoque</li>
          <li>🚨 Notificações de validade próxima de flores e insumos</li>
          <li>📉 Insights sobre queda de vendas por espécie</li>
          <li>👥 Perfis de usuário (Atendente, Gerente, Administrador)</li>
          <li>📊 Relatórios em tempo real para decisões rápidas</li>
        </ul>
      </section>
    </div>
  );
}
