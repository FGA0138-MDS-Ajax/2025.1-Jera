import "../styles/Navebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="top-bar">
        {/* Botão do menu */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menu"
        />

        <h2>{title}</h2>

        <div className="top-bar-actions">
          <Link to="/" className="nav-btn" aria-label="Notificações" />
          <Link to="/" className="profile-btn" aria-label="Perfil do usuário" />
        </div>
      </header>

      {sidebarOpen && (
        <aside className="sidebar">
          {/* Agora é um link para a página inicial */}
          <Link
            to="/inicio"
            className="sidebar-title"
            onClick={() => setSidebarOpen(false)}
          >
            FloraGest
          </Link>

          <hr />

          <nav className="sidebar-links">
            <button className="sidebar-link">Gestão de Lotes</button>
            <button className="sidebar-link">Catálogo</button>
          </nav>
        </aside>
      )}
    </>
  );
}
