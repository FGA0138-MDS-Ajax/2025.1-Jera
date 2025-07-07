import React, { useState, useEffect } from "react";
import "../styles/Lotes.css";
import Navbar from "../Components/Navebar";
import Loading from "../Components/Load_icon";
import deletarIcon from "../assets/deletar.png";

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
  const [form, setForm] = useState({
    nome_lote: "",
    id_produto: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/lote")
      .then((res) => res.json())
      .then(async (data) => {
        const lotesComNome = await Promise.all(
          data.map(async (lote: Lote) => {
            if (lote.produto_nome) return lote;
            const res = await fetch(`/api/product/${lote.id_produto}`);
            const produto = await res.json();
            return { ...lote, produto_nome: produto.nome_produto };
          })
        );
        setLotes(lotesComNome);
        setLoading(false);
      });
    fetch("/api/product")
      .then((res) => res.json())
      .then(setProdutos);
  }, []);

  const handleDelete = async (id_lote: number) => {
    if (!window.confirm("Deseja realmente deletar este lote?")) return;
    const res = await fetch(`/api/lote/${id_lote}`, { method: "DELETE" });
    if (res.ok) {
      setLotes((prev) => prev.filter((l) => l.id_lote !== id_lote));
    } else {
      alert("Erro ao deletar lote.");
    }
  };

  const abrirEdicaoNome = (lote: Lote) => {
    setEditNomeId(lote.id_lote);
    setNovoNome(lote.nome_lote);
  };

  const salvarNome = async (lote: Lote) => {
    if (!novoNome.trim()) return;
    const res = await fetch(`/api/lote/${lote.id_lote}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome_lote: novoNome }),
    });
    if (res.ok) {
      setLotes((prev) =>
        prev.map((l) =>
          l.id_lote === lote.id_lote ? { ...l, nome_lote: novoNome } : l
        )
      );
      setEditNomeId(null);
    } else {
      alert("Erro ao editar nome do lote.");
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
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/lote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_lote: form.nome_lote,
        id_produto: Number(form.id_produto),
      }),
    });
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
    } else {
      alert("Erro ao cadastrar lote.");
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
              {lotes.map((lote) => (
                <div key={lote.id_lote} className="card-lote">
                  {/* Status e botão deletar no topo direito */}
                  <div className="lote-card-actions">
                    <span
                      className={`status ${lote.concluido ? "inativo" : ""}`}
                      title={lote.concluido ? "Concluído" : "Ativo"}
                    >
                      {lote.concluido ? "Concluído" : "Ativo"}
                    </span>
                    <button
                      className="delete-lote-btn"
                      title="Excluir lote"
                      onClick={() => handleDelete(lote.id_lote)}
                    >
                      <img src={deletarIcon} alt="Deletar" />
                    </button>
                  </div>

                  <div className="lote-header">
                    <span className="lote-id">Lote #{lote.id_lote}</span>
                  </div>
                  {/* Badge tipo produto estilo GitHub */}
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
                  {/* Mini-card para editar nome */}
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
              ))}
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