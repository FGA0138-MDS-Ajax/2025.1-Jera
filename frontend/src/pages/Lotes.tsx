import React, { useState, useMemo, useEffect } from "react";
import "../styles/Lotes.css";
import Navbar from "../Components/Navebar";

type EstadoFlor = "Ótimo" | "Regular" | "Ruim";
type StatusLote = "Ativo" | "Inativo";

interface ContagemEstados {
  Ótimo: number;
  Regular: number;
  Ruim: number;
}

interface Lote {
  id: string; // texto digitado pelo usuário
  flor: string;
  quantidade: number; // total de flores do lote
  estados: ContagemEstados; // distribuição das flores
  status: StatusLote;
}

const LOTES_MOCK: Lote[] = [];

function calculaEstadoModa(estados: ContagemEstados): EstadoFlor {
  const { Ótimo, Regular, Ruim } = estados;
  const max = Math.max(Ótimo, Regular, Ruim);
  if (max === 0) return "Regular";
  if (Ótimo === max) return "Ótimo";
  if (Regular === max) return "Regular";
  return "Ruim";
}

/* ─────────── MODAL NOVO LOTE ─────────── */
interface ModalNovoLoteProps {
  onClose: () => void;
  onCriar: (dados: { identificador: string; flor: string }) => void;
}
function ModalNovoLote({ onClose, onCriar }: ModalNovoLoteProps) {
  const [identificador, setIdentificador] = useState("");
  const [flor, setFlor] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h4>Registrar Novo Lote</h4>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <label>Identificador do Lote</label>
          <input
            placeholder="Ex: 126"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />

          <label style={{ marginTop: 8 }}>Tipo de Flor para o Lote</label>
          <input
            placeholder="Ex: Rosa Vermelha"
            value={flor}
            onChange={(e) => setFlor(e.target.value)}
          />

          <button
            className="btn-novo-lote"
            style={{ marginTop: 16 }}
            onClick={() => {
              if (identificador.trim() && flor.trim()) {
                onCriar({ identificador, flor });
                onClose();
              }
            }}
          >
            Criar Lote
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── MODAL ESPECIFICAÇÕES ─────────── */
interface ModalEspecificacoesProps {
  lote: Lote;
  onClose: () => void;
  onSalvar: (loteAtualizado: Lote) => void;
  onExcluir: (id: string) => void;
}
function ModalEspecificacoes({
  lote,
  onClose,
  onSalvar,
  onExcluir,
}: ModalEspecificacoesProps) {
  const [aba, setAba] = useState<"quantidade" | "estado">("quantidade");
  const [quantidade, setQuantidade] = useState<number>(lote.quantidade);
  const [estados, setEstados] = useState<ContagemEstados>({ ...lote.estados });
  const [erro, setErro] = useState("");

  useEffect(() => {
    const soma = estados.Ótimo + estados.Regular + estados.Ruim;
    if (soma > quantidade) {
      setErro("Quantidade acima do estoque");
    } else {
      setErro("");
    }
  }, [estados, quantidade]);

  const alterarEstado = (estado: EstadoFlor, delta: number) => {
    setEstados((prev) => {
      const novoValor = Math.max(0, prev[estado] + delta);
      return { ...prev, [estado]: novoValor };
    });
  };

  const confirmarExclusao = () => {
    if (window.confirm(`Deseja realmente excluir o lote #${lote.id}?`)) {
      onExcluir(lote.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h4>Especificações do Lote</h4>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-subheader">
          <span style={{ fontWeight: 600 }}>
            Lote #{lote.id} ‑ {lote.flor}
          </span>
        </div>

        <div className="modal-tabs">
          <button
            className={aba === "quantidade" ? "tab-active" : ""}
            onClick={() => setAba("quantidade")}
          >
            Ajustar Quantidade
          </button>
          <button
            className={aba === "estado" ? "tab-active" : ""}
            onClick={() => setAba("estado")}
          >
            Atualizar Estados
          </button>
        </div>

        <div className="modal-body">
          {aba === "quantidade" && (
            <>
              <label>Quantidade Total</label>
              <div className="quantidade-ajuste">
                <button
                  onClick={() => setQuantidade((q) => Math.max(0, q - 1))}
                >
                  -
                </button>
                <input type="number" value={quantidade} readOnly />
                <button onClick={() => setQuantidade((q) => q + 1)}>+</button>
              </div>
              <p className="info-text">
                Distribuição atual:{" "}
                {estados.Ótimo + estados.Regular + estados.Ruim} / {quantidade}
              </p>
            </>
          )}

          {aba === "estado" && (
            <>
              <label>Distribuir Estados das Flores</label>
              {(["Ótimo", "Regular", "Ruim"] as EstadoFlor[]).map((e) => (
                <div key={e} className="estado-linha">
                  <span className="estado-label">{e}</span>
                  <div className="estado-controles">
                    <button onClick={() => alterarEstado(e, -1)}>-</button>
                    <input type="number" value={estados[e]} readOnly />
                    <button onClick={() => alterarEstado(e, 1)}>+</button>
                  </div>
                </div>
              ))}
              <p className="info-text">
                Total distribuído:{" "}
                {estados.Ótimo + estados.Regular + estados.Ruim} / {quantidade}
              </p>
              {erro && <p className="erro-text">{erro}</p>}
            </>
          )}

          <button
            style={{ marginTop: 16 }}
            className="btn-novo-lote"
            disabled={!!erro}
            onClick={() => {
              onSalvar({ ...lote, quantidade, estados });
              onClose();
            }}
          >
            Salvar Alterações
          </button>

          <button
            style={{
              marginTop: 8,
              backgroundColor: "#cc0000",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={confirmarExclusao}
          >
            Excluir Lote
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── MODAL DETALHES ─────────── */
interface ModalDetalhesProps {
  lote: Lote;
  onClose: () => void;
}
function ModalDetalhes({ lote, onClose }: ModalDetalhesProps) {
  const { estados } = lote;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h4>Detalhes do Lote</h4>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-subheader">
          <span style={{ fontWeight: 600 }}>
            Lote #{lote.id} ‑ {lote.flor}
          </span>
        </div>

        <div className="modal-body">
          <p>
            <b>Quantidade total:</b> {lote.quantidade}
          </p>
          <p>
            <b>Flores em Ótimo:</b> {estados.Ótimo}
          </p>
          <p>
            <b>Flores em Regular:</b> {estados.Regular}
          </p>
          <p>
            <b>Flores em Ruim:</b> {estados.Ruim}
          </p>

          <button
            style={{ marginTop: 16 }}
            className="btn-detalhes"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── PÁGINA LOTES ─────────── */
function Lotes() {
  const [lotes, setLotes] = useState<Lote[]>(LOTES_MOCK);

  const [modalNovo, setModalNovo] = useState(false);
  const [modalEsp, setModalEsp] = useState<Lote | null>(null);
  const [modalDet, setModalDet] = useState<Lote | null>(null);

  // filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroId, setFiltroId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"Todos" | EstadoFlor>(
    "Todos"
  );
  const [filtroStatus, setFiltroStatus] = useState<"Todos" | StatusLote>(
    "Todos"
  );

  const salvarEdicoes = (loteAtualizado: Lote) => {
    setLotes((prev) =>
      prev.map((l) =>
        l.id === loteAtualizado.id
          ? {
              ...loteAtualizado,
              status: loteAtualizado.quantidade === 0 ? "Inativo" : "Ativo",
            }
          : l
      )
    );
  };

  const excluirLote = (id: string) => {
    setLotes((prev) => prev.filter((l) => l.id !== id));
  };

  const lotesFiltrados = useMemo(() => {
    return lotes.filter((lote) => {
      const nomeOk = lote.flor.toLowerCase().includes(filtroNome.toLowerCase());
      const idOk = lote.id.toLowerCase().includes(filtroId.toLowerCase());

      const estadoModa = calculaEstadoModa(lote.estados);
      const estadoOk = filtroEstado === "Todos" || estadoModa === filtroEstado;

      const statusOk = filtroStatus === "Todos" || lote.status === filtroStatus;

      return nomeOk && idOk && estadoOk && statusOk;
    });
  }, [lotes, filtroNome, filtroId, filtroEstado, filtroStatus]);

  return (
    <div className="wrapper-lotes">
      <Navbar title="Gestão de Lotes" />

      <div className="gestao-lotes-container">
        <main className="main-content">
          <h3 className="titulo">Lotes Registrados</h3>

          <button className="btn-novo-lote" onClick={() => setModalNovo(true)}>
            + Registrar Novo Lote
          </button>

          <section className="filtros">
            <input
              placeholder="Nome da flor do lote..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />

            <input
              placeholder="Identificador do lote..."
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
              style={{ marginLeft: 8 }}
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              style={{ marginLeft: 8 }}
            >
              <option value="Todos">Todos</option>
              <option value="Ótimo">Ótimo</option>
              <option value="Regular">Regular</option>
              <option value="Ruim">Ruim</option>
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
              style={{ marginLeft: 8 }}
            >
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </section>

          <section className="lista-lotes">
            {lotesFiltrados.length === 0 ? (
              <p className="info-text">Nenhum lote cadastrado ainda.</p>
            ) : (
              lotesFiltrados.map((lote) => {
                const estadoModa = calculaEstadoModa(lote.estados);
                return (
                  <div
                    key={lote.id}
                    className={`card-lote ${
                      lote.status === "Inativo" ? "inativo" : ""
                    }`}
                  >
                    <div className="lote-header">
                      <span className="lote-id">Lote #{lote.id}</span>
                      <span
                        className={`status ${
                          lote.status === "Ativo" ? "ativo" : "inativo"
                        }`}
                      >
                        {lote.status}
                      </span>
                    </div>

                    <div
                      className="lote-flor"
                      style={{
                        color:
                          lote.flor === "Rosa Vermelha"
                            ? "#a0522d"
                            : lote.flor === "Tulipa Rosa"
                            ? "#b87333"
                            : lote.flor === "Girassol"
                            ? "#b8860b"
                            : "#888",
                      }}
                    >
                      {lote.flor}
                    </div>

                    <div className="lote-info">
                      <span>
                        Quantidade: <b>{lote.quantidade} flores</b>
                      </span>
                      <span>
                        Estado Médio:{" "}
                        <b className={`estado ${estadoModa.toLowerCase()}`}>
                          {estadoModa}
                        </b>
                      </span>
                    </div>

                    <div className="acoes-lote">
                      <button
                        className="btn-detalhes"
                        onClick={() => setModalEsp(lote)}
                      >
                        Especificações
                      </button>
                      <button
                        className="btn-detalhes secundario"
                        onClick={() => setModalDet(lote)}
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </main>
      </div>

      {modalNovo && (
        <ModalNovoLote
          onClose={() => setModalNovo(false)}
          onCriar={({ identificador, flor }) => {
            setLotes((prev) => [
              ...prev,
              {
                id: identificador,
                flor,
                quantidade: 0,
                estados: { Ótimo: 0, Regular: 0, Ruim: 0 },
                status: "Inativo",
              },
            ]);
          }}
        />
      )}

      {modalEsp && (
        <ModalEspecificacoes
          lote={modalEsp}
          onClose={() => setModalEsp(null)}
          onSalvar={salvarEdicoes}
          onExcluir={excluirLote}
        />
      )}

      {modalDet && (
        <ModalDetalhes lote={modalDet} onClose={() => setModalDet(null)} />
      )}
    </div>
  );
}

export default Lotes;
