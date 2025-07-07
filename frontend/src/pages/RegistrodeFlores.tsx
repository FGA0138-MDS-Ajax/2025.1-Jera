import React, { useEffect, useState } from "react";
import "../styles/RegistrodeFlores.css";
import Navbar from "../Components/Navebar";

interface Lote {
  id_lote: number;
  nome_lote: string;
  produto_nome: string;
  id_produto: number;
  quantidade_atual: number;
  estoque_minimo: number;
  estoque_maximo: number | null;
  data_entrada: string;
  estado_predominante?: string;
}

interface EstadoEstetico {
  id_estado_estetico: number;
  nome_estado_estetico: string;
}

export default function Registro() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteSelecionado, setLoteSelecionado] = useState<Lote | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [estado, setEstado] = useState<number | null>(null);
  const [estados, setEstados] = useState<EstadoEstetico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [movimentando, setMovimentando] = useState(false);

  // Buscar lotes reais do backend
  useEffect(() => {
    setLoading(true);
    fetch("/api/lote")
      .then((res) => res.json())
      .then(async (data) => {
        // Buscar nome do produto e estoque min/max para cada lote
        const lotesComProduto = await Promise.all(
          data.map(async (lote: any) => {
            let produto_nome = "";
            let estoque_minimo = 0;
            let estoque_maximo = null;
            try {
              const res = await fetch(`/api/product/${lote.id_produto}`);
              const produto = await res.json();
              produto_nome = produto.nome_produto;
              estoque_minimo = produto.estoque_minimo;
              estoque_maximo = produto.estoque_maximo;
            } catch {}
            return {
              ...lote,
              produto_nome,
              estoque_minimo,
              estoque_maximo,
            };
          })
        );
        setLotes(lotesComProduto);
        setLoading(false);
      });
    // Buscar estados estéticos
    fetch("/api/estado_estetico")
      .then((res) => res.json())
      .then(setEstados)
      .catch(() => setEstados([]));
  }, []);

  const lotesFiltrados = lotes.filter((l) =>
    l.nome_lote.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const abrirModal = (lote: Lote) => {
    setLoteSelecionado(lote);
    setQuantidade(1);
    setEstado(estados[0]?.id_estado_estetico ?? null);
  };

  const fecharModal = () => setLoteSelecionado(null);

  const movimentar = async (tipo: "entrada" | "saida") => {
    if (!loteSelecionado || !estado) return;
    setMovimentando(true);
    const payload = {
      id_produto: loteSelecionado.id_produto,
      tipo_movimentacao: tipo === "entrada",
      quantidade,
      motivo: "Movimentação manual",
      id_lote: loteSelecionado.id_lote,
      id_estado_estetico: estado,
    };
    const endpoint =
      tipo === "entrada"
        ? "/api/movimentacao/entrada"
        : "/api/movimentacao/saida";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMovimentando(false);
    if (res.ok) {
      alert("Movimentação registrada com sucesso!");
      fecharModal();
      // Atualiza lotes
      setLoading(true);
      fetch("/api/lote")
        .then((res) => res.json())
        .then(async (data) => {
          const lotesComProduto = await Promise.all(
            data.map(async (lote: any) => {
              let produto_nome = "";
              let estoque_minimo = 0;
              let estoque_maximo = null;
              try {
                const res = await fetch(`/api/product/${lote.id_produto}`);
                const produto = await res.json();
                produto_nome = produto.nome_produto;
                estoque_minimo = produto.estoque_minimo;
                estoque_maximo = produto.estoque_maximo;
              } catch {}
              return {
                ...lote,
                produto_nome,
                estoque_minimo,
                estoque_maximo,
              };
            })
          );
          setLotes(lotesComProduto);
          setLoading(false);
        });
    } else {
      const data = await res.json();
      alert(data.detail || "Erro ao registrar movimentação.");
    }
  };

  return (
    <>
      <Navbar title="Movimentação de Estoque" />

      <div className="registro-container">
        <section className="filtros">
          <label>
            <span>Pesquisar Lote</span>
            <input
              placeholder="Nome do lote…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </section>

        {loading ? (
          <div style={{ textAlign: "center", margin: "2rem" }}>Carregando...</div>
        ) : lotesFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", margin: "2rem" }}>
            Nenhum lote encontrado.
          </div>
        ) : (
          lotesFiltrados.map((lote) => (
            <div key={lote.id_lote} className="lote-card">
              <div className="lote-info">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      background: "#e2725b",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 8,
                      fontSize: "0.98rem",
                      padding: "0.13rem 0.7rem",
                      letterSpacing: 0.5,
                      display: "inline-block"
                    }}
                  >
                    {lote.produto_nome}
                  </span>
                  <h2 style={{ margin: 0, marginLeft: 6, color: "#b64c38", fontWeight: 700, fontSize: "1.08rem" }}>
                    {lote.nome_lote}
                  </h2>
                </div>
                <div className="info-row">
                  <span>
                    <b>Data de Criação:</b>{" "}
                    {new Date(lote.data_entrada).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span>
                    <b>Qtd. Atual:</b> {lote.quantidade_atual}
                  </span>
                  <span>
                    <b>Estoque Mínimo:</b> {lote.estoque_minimo}
                  </span>
                  {lote.estoque_maximo !== null && (
                    <span>
                      <b>Estoque Máximo:</b> {lote.estoque_maximo}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <span>
                    <b>Estado Predominante:</b>{" "}
                    {lote.estado_predominante || "N/A"}
                  </span>
                </div>
                <button
                  className="btn-movimentacao"
                  onClick={() => estados.length > 0 && abrirModal(lote)}
                  disabled={estados.length === 0}
                >
                  Movimentar Estoque
                </button>
              </div>
            </div>
          ))
        )}



          {loteSelecionado && (
          <div className="modal-overlay" onClick={fecharModal}>
            <div
              className="modal-conteudo movimentacao-modal"
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="btn-fechar-x" onClick={fecharModal}>
                ×
              </button>
              <h2 className="modal-titulo" style={{ textAlign: "center" }}>
                Movimentação de Estoque
              </h2>
              <div
                className="modal-detalhes-lote"
                style={{
                  width: "100%",
                  background: "#fffbe7",
                  border: "1.5px solid #e2725b",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px #0001",
                  padding: "1.1rem 1.2rem 0.7rem 1.2rem",
                  marginBottom: "1.5rem",
                  fontSize: "1.1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "1.15rem" }}>
                  Lote: <span style={{ color: "#b64c38" }}>{loteSelecionado.nome_lote}</span>
                </div>
                <div>
                  Produto: <span style={{ fontWeight: 500 }}>{loteSelecionado.produto_nome}</span>
                </div>
              </div>

              <form
                className="modal-form movimentacao-form"
                style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
                onSubmit={e => {
                  e.preventDefault();
                  movimentar("entrada");
                }}
              >
                <div className="campo" style={{ width: "100%", maxWidth: 250, marginBottom: 18 }}>
                  <label htmlFor="quantidade-mov" style={{ display: "block", textAlign: "center" }}>Quantidade</label>
                  <div className="quantidade-box" style={{ justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                      disabled={movimentando}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantidade}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setQuantidade(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="quantidade-num"
                      style={{
                        width: 100,
                        textAlign: "center",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        margin: "0 0.5rem"
                      }}
                      disabled={movimentando}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantidade((q) => q + 1)}
                      disabled={movimentando}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="campo" style={{ width: "100%", maxWidth: 250, marginBottom: 18 }}>
                  <label htmlFor="estado-estetico" style={{ display: "block", textAlign: "center" }}>Estado Estético</label>
                  <select
                    id="estado-estetico"
                    value={estado ?? ""}
                    onChange={e => setEstado(Number(e.target.value))}
                    disabled={movimentando || estados.length === 0}
                    required
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <option value="" disabled>
                      {estados.length === 0 ? "Carregando..." : "Selecione..."}
                    </option>
                    {estados.map(est => (
                      <option key={est.id_estado_estetico} value={est.id_estado_estetico}>
                        {est.nome_estado_estetico}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="acoes-movimentacao" style={{ width: "100%", maxWidth: 350, display: "flex", justifyContent: "center", gap: 12 }}>
                  <button
                    className="btn-entrada"
                    type="button"
                    onClick={() => movimentar("entrada")}
                    disabled={movimentando}
                    style={{ flex: 1 }}
                  >
                    + Entrada
                  </button>
                  <button
                    className="btn-saida"
                    type="button"
                    onClick={() => movimentar("saida")}
                    disabled={movimentando}
                    style={{ flex: 1 }}
                  >
                    - Saída
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}