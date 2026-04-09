import React, { useState, useEffect } from "react";
import "../styles/Lotes.css";
import Navbar from "../Components/Navebar";
import Loading from "../Components/Load_icon";
import deletarIcon from "../assets/deletar.png";
import { useToast } from "../Components/Toast/ToastContext";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

interface Lote {
  id_lote: number;
  id_produto: number;
  nome_lote: string;
  quantidade_atual: number;
  data_entrada: string;
  concluido: boolean;
  estado_predominante?: string;
  produto_nome?: string;
}

interface Produto {
  id_produto: number;
  nome_produto: string;
}

function Lotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editNomeId, setEditNomeId] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { showWarning } = useToast();
  const { makeAuthenticatedCall } = useApiErrorHandler();
  const [form, setForm] = useState({
    nome_lote: "",
    id_produto: "",
  });
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/lote", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const lotesComNome = await Promise.all(
          data.map(async (lote: Lote) => {
            if (lote.produto_nome) return lote;
            const res = await fetch(`/api/product/${lote.id_produto}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
            const produto = await res.json();
            return { ...lote, produto_nome: produto.nome_produto };
          })
        );
        setLotes(lotesComNome);
        setLoading(false);
      });
    fetch("/api/product", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProdutos);
  }, []);

  const handleDelete = async (id_lote: number) => {
    if (!window.confirm("Deseja realmente deletar este lote?")) return;
    try {
      const res = await makeAuthenticatedCall(
        `/api/lote/${id_lote}`, 
        { method: "DELETE" },
        "Lote deletado com sucesso!"
      );
      if (res.ok) {
        setLotes((prev) => prev.filter((l) => l.id_lote !== id_lote));
      }
    } catch (error) {
      // Error is already handled by the API error handler
    }
  };

  const abrirEdicaoNome = (lote: Lote) => {
    setEditNomeId(lote.id_lote);
    setNovoNome(lote.nome_lote);
  };

  const salvarNome = async (lote: Lote) => {
    if (!novoNome.trim()) return;
    try {
      const res = await makeAuthenticatedCall(
        `/api/lote/${lote.id_lote}`,
        {
          method: "PUT",
          body: JSON.stringify({ nome_lote: novoNome }),
        },
        "Nome do lote atualizado com sucesso!"
      );
      if (res.ok) {
        setLotes((prev) =>
          prev.map((l) =>
            l.id_lote === lote.id_lote ? { ...l, nome_lote: novoNome } : l
          )
        );
        setEditNomeId(null);
      }
    } catch (error) {
      // Error is already handled by the API error handler
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setForm({ nome_lote: "", id_produto: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome_lote || !form.id_produto) {
      showWarning("Preencha todos os campos obrigatórios.");
      return;
    }
    setSaving(true);
    try {
      const res = await makeAuthenticatedCall(
        "/api/lote",
        {
          method: "POST",
          body: JSON.stringify({
            nome_lote: form.nome_lote,
            id_produto: Number(form.id_produto),
          }),
        },
        "Lote cadastrado com sucesso!"
      );
      if (res.ok) {
        const novoLote = await res.json();
        const produto = produtos.find(
          (p) => p.id_produto === Number(form.id_produto)
        );
        setLotes((prev) => [
          {
            ...novoLote,
            produto_nome: produto?.nome_produto || `Produto #${form.id_produto}`,
          },
          ...prev,
        ]);
        closeModal();
      }
    } catch (error) {
      // Error is already handled by the API error handler
    }
    setSaving(false);
  };

  return (
    <div className="wrapper-lotes">
      <Navbar title="Gestão de Lotes" />
      <div className="gestao-lotes-container">
        <main className="main-content">
          <h3 className="titulo">Lotes Registrados</h3>
          <button className="btn-novo-lote" onClick={openModal}>
            + Novo Lote
          </button>
          {loading ? (
            <Loading />
          ) : lotes.length === 0 ? (
            <p className="info-text">Nenhum lote cadastrado ainda.</p>
          ) : (
            <section className="lista-lotes">
              {lotes.map((lote) => {
              const isInativo = lote.concluido || lote.quantidade_atual === 0;
              return (
                <div key={lote.id_lote} className="card-lote">
                  <div className="lote-card-header">
                    <span className="lote-nome">{lote.nome_lote}</span>
                    <div className="lote-header-direita">
                      <span
                        className={`status ${isInativo ? "inativo" : ""}`}
                        title={isInativo ? "Inativo" : "Ativo"}
                      >
                        {isInativo ? "Inativo" : "Ativo"}
                      </span>
                      <button
                        className="delete-lote-btn"
                        title="Excluir lote"
                        onClick={() => handleDelete(lote.id_lote)}
                      >
                        <img src={deletarIcon} alt="Deletar" />
                      </button>
                    </div>
                  </div>
                  <div className="lote-produto-badge">
                    {lote.produto_nome || `Produto #${lote.id_produto}`}
                  </div>
                  <div className="lote-info">
                    <span>
                      <b>Data de Criação:</b>{" "}
                      {new Date(lote.data_entrada).toLocaleDateString()}
                    </span>
                    <span>
                      <b>Quantidade Atual:</b> {lote.quantidade_atual}
                    </span>
                    <span>
                      <b>Estado Predominante:</b>{" "}
                      {lote.estado_predominante || "N/A"}
                    </span>
                  </div>
                  <div className="acoes-lote">
                    <button
                      className="btn-detalhes secundario"
                      onClick={() => abrirEdicaoNome(lote)}
                    >
                      Editar Nome
                    </button>
                  </div>
                  {editNomeId === lote.id_lote && (
                    <div className="mini-card-editar-nome">
                      <input
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        maxLength={50}
                        className="input-editar-nome"
                        autoFocus
                      />
                      <button
                        className="btn-salvar-nome"
                        onClick={() => salvarNome(lote)}
                      >
                        Salvar
                      </button>
                      <button
                        className="btn-cancelar-nome"
                        onClick={() => setEditNomeId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
                );
              })}
            </section>
          )}
        </main>
      </div>

      {/* Modal de cadastro de lote */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <header className="modal-header">
              <button className="close-x" onClick={closeModal}>
                ×
              </button>
              <h2>Novo Lote</h2>
            </header>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label>
                <span>Nome do Lote</span>
                <input
                  name="nome_lote"
                  value={form.nome_lote}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nome_lote: e.target.value }))
                  }
                  required
                  placeholder="Ex: Lote Primavera"
                />
              </label>
              <label>
                <span>Produto</span>
                <select
                  name="id_produto"
                  value={form.id_produto}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, id_produto: e.target.value }))
                  }
                  required
                >
                  <option value="">Selecione...</option>
                  {produtos.map((p) => (
                    <option key={p.id_produto} value={p.id_produto}>
                      {p.nome_produto}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="save-button" disabled={saving}>
                {saving ? "Salvando..." : "Cadastrar Lote"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lotes;