import React, { useEffect, useMemo, useState } from "react";
import "../styles/RegistrodeFlores.css";
import Navbar from "../Components/Navebar"; // ✅ Importação da Navbar

type EstadoEstetico = "Ótimo" | "Bom" | "Ruim";

interface Lote {
  id: number;
  nome: string;
  tipo: string;
  categoria: string;
  estoqueMin: number;
  estoqueMax: number;
}

export default function Registro() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteSelecionado, setLoteSelecionado] = useState<Lote | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [estado, setEstado] = useState<EstadoEstetico>("Ótimo");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: Substituir por chamada real à API
    setLotes([
      {
        id: 1,
        nome: "Rosa Vermelha",
        tipo: "Tropical",
        categoria: "Flor",
        estoqueMin: 20,
        estoqueMax: 150,
      },
      {
        id: 2,
        nome: "Orquídea Branca",
        tipo: "Orquídea",
        categoria: "Flor",
        estoqueMin: 10,
        estoqueMax: 80,
      },
      {
        id: 3,
        nome: "Girassol",
        tipo: "Campestre",
        categoria: "Flor",
        estoqueMin: 15,
        estoqueMax: 120,
      },
    ]);
  }, []);

  const orderedLotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return lotes;

    return [...lotes].sort((a, b) => {
      const aMatch = a.nome.toLowerCase().includes(term) ? 0 : 1;
      const bMatch = b.nome.toLowerCase().includes(term) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return a.nome.localeCompare(b.nome);
    });
  }, [lotes, searchTerm]);

  const abrirModal = (lote: Lote) => {
    setLoteSelecionado(lote);
    setQuantidade(1);
    setEstado("Ótimo");
  };

  const fecharModal = () => setLoteSelecionado(null);

  const movimentar = (tipo: "entrada" | "saida") => {
    if (!loteSelecionado) return;

    // TODO: chamada real ao backend
    console.log({
      loteId: loteSelecionado.id,
      tipo,
      quantidade,
      estado,
    });

    alert(
      `${
        tipo === "entrada" ? "Adicionado" : "Removido"
      } ${quantidade} unidades do lote ${loteSelecionado.nome}`
    );
    fecharModal();
  };

  return (
    <>
      <Navbar title="Registro de Flores" />

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

        {orderedLotes.map((lote) => (
          <div key={lote.id} className="lote-card">
            <div className="lote-info">
              <h2>{lote.nome}</h2>
              <div className="info-row">
                <span>
                  <b>Tipo:</b> {lote.tipo}
                </span>
                <span>
                  <b>Categoria:</b> {lote.categoria}
                </span>
              </div>
              <div className="info-row">
                <span>
                  <b>Estoque Mínimo:</b> {lote.estoqueMin} unidades
                </span>
                <span>
                  <b>Estoque Máximo:</b> {lote.estoqueMax} unidades
                </span>
              </div>
              <button
                className="btn-movimentacao"
                onClick={() => abrirModal(lote)}
              >
                Movimentação
              </button>
            </div>
          </div>
        ))}

        {loteSelecionado && (
          <div className="modal-overlay" onClick={fecharModal}>
            <div
              className="modal-conteudo"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="btn-fechar-x" onClick={fecharModal}>
                ×
              </button>
              <h3>Movimentar Estoque: {loteSelecionado.nome}</h3>

              <div className="campo">
                <label>Quantidade</label>
                <div className="quantidade-box">
                  <button
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span>{quantidade}</span>
                  <button onClick={() => setQuantidade((q) => q + 1)}>+</button>
                </div>
              </div>

              <div className="campo">
                <label>Estado</label>
                <div className="estado-box">
                  {(["Ótimo", "Bom", "Ruim"] as EstadoEstetico[]).map((op) => (
                    <button
                      key={op}
                      className={estado === op ? "ativo" : ""}
                      onClick={() => setEstado(op)}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div className="acoes">
                <button
                  className="btn-entrada"
                  onClick={() => movimentar("entrada")}
                >
                  + Adicionar ao Estoque
                </button>
                <button
                  className="btn-saida"
                  onClick={() => movimentar("saida")}
                >
                  - Remover do Estoque
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
