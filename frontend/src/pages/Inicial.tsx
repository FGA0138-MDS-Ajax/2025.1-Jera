import { Link } from "react-router-dom";
import Navbar from "../Components/Navebar";
import "../styles/Inicial.css";

export default function Inicial() {
  return (
    <div className="home-page">
      <Navbar title="Página Inicial" />

      <main className="buttons-area">
        <div className="funcionalidades-box">
          <h2>Funcionalidades</h2>
        </div>

        <div className="buttons-list">
          <Link to="/lotes" className="nav-link-btn lotes-btn">
            Lotes
          </Link>
          <Link to="/cadastro" className="nav-link-btn cadastro-btn">
            Cadastro
          </Link>
          <Link to="/registro" className="nav-link-btn registro-btn">
            Registro
          </Link>
          <Link to="/dashboard" className="nav-link-btn dashboard-btn">
            Dashboard
          </Link>
          <Link to="/usuarios" className="nav-link-btn usuarios-btn">
            Usuários
          </Link>
        </div>
      </main>
    </div>
  );
}
