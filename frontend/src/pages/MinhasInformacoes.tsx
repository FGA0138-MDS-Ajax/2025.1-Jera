import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navebar";
import "../styles/MinhasInformacoes.css";

interface InformacoesUsuario {
  nome: string;
  email: string;
  telefone: string;
  permissao: string;
}

const MinhasInformacoes: React.FC = () => {
  const [usuario, setUsuario] = useState<InformacoesUsuario>({
    nome: "",
    email: "",
    telefone: "",
    permissao: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Descomente e configure quando integrar com o backend
    /*
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/usuario/me");
        if (!resp.ok) throw new Error("Erro ao buscar dados do usuário");
        const data: InformacoesUsuario = await resp.json();
        setUsuario(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
    */
  }, []);

  return (
    <>
      {/* Navbar fixa no topo */}
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
            <div className="perfil-item">
              <strong className="perfil-label">Telefone:</strong>
              <span className="perfil-valor">{usuario.telefone}</span>
            </div>
          </section>

          <section className="perfil-secao">
            <h3 className="perfil-subtitulo">Informações Corporativas</h3>
            <div className="perfil-item">
              <strong className="perfil-label">Função (Cargo):</strong>
              <span className="perfil-valor">{usuario.permissao}</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MinhasInformacoes;
