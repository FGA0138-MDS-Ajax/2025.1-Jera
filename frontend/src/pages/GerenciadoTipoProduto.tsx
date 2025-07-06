import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/GerenciarTipoProduto.css";
import deletarIcon from "../assets/deletar.png";
import "../styles/Inicial.css";


interface TipoProduto {
  id_tipo_produto: number;
  nome_tipo_produto: string;
}

export default function GerenciarTiposProduto() {
  const [tipos, setTipos] = useState<TipoProduto[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mensagemTipo, setMensagemTipo] = useState<"sucesso" | "erro" | "">("");

  // Buscar tipos do backend
  const fetchTipos = () => {
    fetch("/api/product_type")
      .then((res) => res.json())
      .then((data) => setTipos(data));
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleCriar = async () => {
    setMensagem("");
    setMensagemTipo("");
    const nomeTrim = novoNome.trim().toLowerCase();
    if (!nomeTrim) {
      setMensagem("Digite o nome do novo tipo de produto.");
      setMensagemTipo("erro");
      return;
    }
    if (tipos.some(t => t.nome_tipo_produto.trim().toLowerCase() === nomeTrim)) {
      setMensagem("Este tipo de produto já foi cadastrado.");
      setMensagemTipo("erro");
      return;
    }
    const res = await fetch("/api/product_type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome_tipo_produto: novoNome.trim() }),
    });
    if (res.ok) {
      setMensagem("Novo tipo cadastrado com sucesso!");
      setMensagemTipo("sucesso");
      setNovoNome("");
      fetchTipos();
    } else {
      setMensagem("Erro ao cadastrar novo tipo.");
      setMensagemTipo("erro");
    }
  };

  const handleRemover = async (id: number) => {
  if (!window.confirm("Tem certeza que deseja remover este tipo de produto?")) return;
  const res = await fetch(`/api/product_type/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    setMensagem("Tipo removido com sucesso!");
    setMensagemTipo("sucesso");
    // Atualiza a lista sem reload
    setTipos((prev) => prev.filter((t) => t.id_tipo_produto !== id));
  } else {
    // Tenta pegar a mensagem do backend
    let msg = "Erro ao remover tipo.";
    try {
      const data = await res.json();
      if (data.detail) {
        msg = data.detail;
      }
    } catch {}
    setMensagem(msg);
    setMensagemTipo("erro");
  }
};

  return (
    <div className="gerenciar-tipo-container">
      
      <Link
        to="/Inicio"
        className="tipo-produto-btn"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          padding: "0.3rem 0.8rem",
          fontSize: "0.8rem",
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        ← Voltar para Início
      </Link>

      <h2>Gerenciar Tipos de Produto</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleCriar();
        }}
        className="form-tipo-produto"
        style={{ marginBottom: "1.5rem" }}
      >
        <label>
          <span>Nome do novo tipo de produto:</span>
          <input
            type="text"
            value={novoNome}
            onChange={e => {
              setNovoNome(e.target.value);
              setMensagem("");
              setMensagemTipo("");
            }}
            placeholder="Ex: Flor, Vaso, Adubo..."
            autoFocus
          />
        </label>
        <button type="submit">Cadastrar novo tipo</button>
      </form>
      <hr style={{ margin: "1.5rem 0" }} />
      <h3 style={{ marginBottom: "1rem" }}>Tipos de produto cadastrados:</h3>
      {tipos.length === 0 && (
        <div style={{ color: "#b64c38", margin: "1rem 0" }}>
          Nenhum tipo de produto cadastrado.
        </div>
      )}
      <ul style={{ listStyle: "none", padding: 0, maxWidth: 320, margin: "0 auto" }}>
        {tipos.map((tipo) => (
          <li
            key={tipo.id_tipo_produto}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 4,
              background: "#f7f7f7",
              borderRadius: 4,
              padding: "0.25rem 0.5rem",
              boxShadow: "0 1px 2px rgba(182,76,56,0.04)",
              fontSize: "0.98rem",
              minHeight: 32,
            }}
          >
            <span style={{ flex: 1, fontWeight: 500, color: "#b64c38" }}>
              {tipo.nome_tipo_produto}
            </span>
            <button
              className="remover-tipo-btn"
              onClick={() => handleRemover(tipo.id_tipo_produto)}
              title="Remover tipo de produto"
              style={{
                background: "transparent",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginLeft: 6,
                transition: "background 0.2s",
                padding: 0,
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#ffeaea")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              <img src={deletarIcon} className="deleteIcon" alt="Remover" style={{ width: 16, height: 16 }} />
            </button>
          </li>
        ))}
      </ul>
      {mensagem && (
        <div
          className={`mensagem ${mensagemTipo}`}
          style={{
            marginTop: 16,
            color: mensagemTipo === "sucesso" ? "green" : "#b64c38",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {mensagem}
        </div>
      )}
    </div>
  );
}