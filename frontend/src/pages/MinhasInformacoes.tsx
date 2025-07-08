import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navebar";
import "../styles/MinhasInformacoes.css";

interface InformacoesUsuario {
  nome: string;
  email: string;
  permissao: string;
}

const MinhasInformacoes: React.FC = () => {
  const [usuario, setUsuario] = useState<InformacoesUsuario>({
    nome: "",
    email: "",
    permissao: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Tenta buscar do backend, se não, pega do localStorage
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        // Tenta buscar do backend
        const resp = await fetch("/api/usuario/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (resp.ok) {
          const data = await resp.json();
          setUsuario({
            nome: data.nomeUsuario || "",
            email: data.email || "",
            permissao: data.perfil || "",
          });
          
        } else {
          // Se não conseguir, pega do localStorage
          const nome = localStorage.getItem("nomeUsuario") || "";
          const email = localStorage.getItem("email") || "";
          const permissao = localStorage.getItem("perfil") || "";
          setUsuario({ nome, email, permissao });
        }
      } catch (err) {
        setError("Erro ao buscar dados do usuário");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <>
      <Navbar title="Meu Perfil" />
      <div className="pagina-perfil">
        <div className="perfil-container">
          <h1 className="perfil-titulo">Meu Perfil</h1>


          {loading && <p>Carregando…</p>}
          {error && <p className="erro">Erro: {error}</p>}

          <section className="perfil-secao">
            <h3 className="perfil-subtitulo">Dados Pessoais</h3>
            <div className="perfil-item">
              <strong className="perfil-label">Nome Completo:</strong>
              <span className="perfil-valor">{usuario.nome}</span>
            </div>
            <div className="perfil-item">
              <strong className="perfil-label">Email:</strong>
              <span className="perfil-valor">{usuario.email}</span>
            </div>
          </section>

          <section className="perfil-secao">
            <h3 className="perfil-subtitulo">Informações Corporativas</h3>
            <div className="perfil-item">
              <strong className="perfil-label">Função (Cargo):</strong>
              <span className="perfil-valor">{usuario.permissao}</span>
            </div>
          </section>

          <button
            className="btn-logout"
            style={{
              background: "#e2725b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "1.5rem",
              float: "right",
            }}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
}
export default MinhasInformacoes;
