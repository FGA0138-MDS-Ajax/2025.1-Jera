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
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menu"
        />

        <h2>{title}</h2>

        <div className="top-bar-actions">
          <Link
            to="/notificacoes"
            className="nav-btn"
            aria-label="Notificações"
          />
          <Link
            to="/minhas-informacoes"
            className="profile-btn"
            aria-label="Perfil do usuário"
          />
        </div>
      </header>

      {sidebarOpen && (
        <aside className="sidebar">
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          />
          <Link
            to="/Inicio"
            className="sidebar-title"
            onClick={() => setSidebarOpen(false)}
          >
            FloraGest
          </Link>

          <hr />

          <nav className="sidebar-links">
            <Link
              to="/tipo-produto"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              Tipo Produto
            </Link>
            <Link
              to="/lotes"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              Lotes
            </Link>
            <Link
              to="/cadastro"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              Cadastro
            </Link>
            <Link
              to="/registro"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              Registro
            </Link>
            <Link
              to="/dashboard"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/usuarios"
              className="sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              Usuários
            </Link>
          </nav>
        </aside>
      )}
    </>
  );
}
