import React, { useEffect, useState, useRef } from "react";
import "../styles/RegistrodeFlores.css";
import Navbar from "../Components/Navebar";
import { useNotificacao } from "../Components/NotificacaoContext";
import { useNavigate } from "react-router-dom";

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

  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [erroSaida, setErroSaida] = useState<string | null>(null);

  const {atualizarQuantidade} = useNotificacao();

  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil");


  useEffect(() => {
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

    fetch("/api/estado_estetico")
      .then((res) => res.json())
      .then(setEstados)
      .catch(() => setEstados([]));
  }, []);

  const lotesFiltrados = lotes.filter((l) =>
    l.nome_lote.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  useEffect(() => {
    if (lotesFiltrados.length === 1 && cardRefs.current[0]) {
      const card = cardRefs.current[0];
      const carousel = carouselRef.current;
      if (card && carousel) {
        const offset = card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;
        carousel.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [lotesFiltrados]);

  const abrirModal = (lote: Lote) => {
    setLoteSelecionado(lote);
    setQuantidade(1);
    setEstado(estados[0]?.id_estado_estetico ?? null);
  };

  const fecharModal = () => setLoteSelecionado(null);

  const idUsuario = Number(localStorage.getItem("idUsuario"));
  

  const movimentar = async (tipo: "entrada" | "saida") => {
    if (!loteSelecionado || !estado) return;
    setMovimentando(true);
    setErroSaida(null); // Limpa erro ao tentar novamente

    const payload = {
      id_produto: loteSelecionado.id_produto,
      tipo_movimentacao: tipo === "entrada",
      quantidade,
      motivo: "Movimentação manual",
      id_lote: loteSelecionado.id_lote,
      id_estado_estetico: estado,
      id_usuario: idUsuario,

    };
    
    if (tipo === "saida" && quantidade > (loteSelecionado.quantidade_atual ?? 0)) {
      setErroSaida("Quantidade de saída maior que o estoque atual!");
      return;
    }

    setMovimentando(true);
    
    const endpoint = tipo === "entrada" ? "/api/movimentacao/entrada" : "/api/movimentacao/saida";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMovimentando(false);
    if (res.ok) {
      alert("Movimentação registrada com sucesso!");
      fecharModal();
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
        await atualizarQuantidade();
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
          <div style={{ textAlign: "center", margin: "2rem" }}>Nenhum lote encontrado.</div>
        ) : (
          <div className="lotes-scroll-wrapper">
            <div className="lotes-carousel" ref={carouselRef}>
              {lotesFiltrados.map((lote, index) => (
                <div
                  key={lote.id_lote}
                  className={`lote-card${lote.estoque_maximo === null ? " sem-estoque-max" : ""}`}
                  ref={el => { cardRefs.current[index] = el; }}
                >
                  <div className="lote-header">
                    <span className="lote-nome" title={lote.nome_lote}>{lote.nome_lote}</span>
                    <span
                      className={
                        "produto-label" +
                        (lote.produto_nome && lote.produto_nome.length > 16 ? " long" : "")
                      }
                      title={lote.produto_nome}
                    >
                      {lote.produto_nome}
                    </span>
                  </div>
                  <div className="info-row">
                    <span><b>Data:</b> {new Date(lote.data_entrada).toLocaleDateString()}</span>
                    <span><b>Qtd.:</b> {lote.quantidade_atual}</span>
                    <span><b>Mín.:</b> {lote.estoque_minimo}</span>
                    {lote.estoque_maximo !== null && (
                      <span><b>Máx.:</b> {lote.estoque_maximo}</span>
                    )}
                    <span><b>Estado:</b> {lote.estado_predominante || "N/A"}</span>
                  </div>
                  <button
                    className="btn-movimentacao"
                    onClick={() => estados.length > 0 && abrirModal(lote)}
                    disabled={estados.length === 0}
                  >
                    Movimentar Estoque
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {perfil === "ADMINISTRADOR" && (
          <div style={{ width: "100%", maxWidth: 420, margin: "2rem auto 0", display: "flex", justifyContent: "center" }}>
            <button
              className="btn-historico-mov"
              style={{
                background: "#b64c38",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 1.5rem",
                fontWeight: 600,
                fontSize: "1.08rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px #0001",
                transition: "background 0.2s",
              }}
              onClick={() => navigate("/historico-movimentacoes")}
            >
              Ver Histórico de Movimentações
            </button>
          </div>
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
                {erroSaida && (
                  <div style={{ color: "#c0392b", marginTop: 8, fontSize: "0.98rem", textAlign: "center"}}>
                    {erroSaida}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}