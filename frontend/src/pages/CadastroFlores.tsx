import { useState, useEffect, useMemo } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "../styles/CadastroFlores.css";
import Navbar from "../Components/Navebar";
import deletarIcon from "../assets/deletar.png";
import florPadrao from "../assets/LogoFloraGest.png";

interface Produto {
  id_produto: number;
  nome_produto: string;
  estoque_minimo: number;
  estoque_maximo?: number | null;
  id_tipo_produto: number;
  tipo_produto_nome?: string;
  stock?: "Com" | "Sem";
  imagem?: string;
}

interface ProdutoForm {
  nome_produto: string;
  estoque_minimo: number;
  estoque_maximo?: number | "";
  id_tipo_produto: number;
  imagem?: string;
}

interface TipoProduto {
  id_tipo_produto: number;
  nome_tipo_produto: string;
}

export default function CadastroFlores() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tiposProduto, setTiposProduto] = useState<TipoProduto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProdutoForm>({
    nome_produto: "",
    estoque_minimo: 0,
    estoque_maximo: "",
    id_tipo_produto: 1,
    imagem: "",
  });

  // Modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProdutoForm & { id_produto?: number }>({
    nome_produto: "",
    estoque_minimo: 0,
    estoque_maximo: "",
    id_tipo_produto: 1,
    imagem: "",
  });

  // Visual: Stock "Com" ou "Sem" (não enviado ao backend)
  const [stockVisual, setStockVisual] = useState<"Com" | "Sem">("Com");

  // Filtros visuais
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  const handleDeleteProduto = async (id_produto: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;
    const res = await fetch(`/api/product/${id_produto}`, { method: "DELETE" });
    if (res.ok) {
      setProdutos((prev) => prev.filter((p) => p.id_produto !== id_produto));
    } else {
      alert("Erro ao deletar produto.");
    }
  };

  // Buscar produtos do backend
  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(
          data.map((p: Produto) => ({
            ...p,
            stock: "Com",
          }))
        );
      });
  }, []);

  // Buscar tipos de produto do backend
  useEffect(() => {
    fetch("/api/product_type")
      .then((res) => res.json())
      .then((data) => {
        setTiposProduto(data);
      });
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setForm((prev) => ({
            ...prev,
            imagem: ev.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "estoque_minimo" || name === "estoque_maximo" || name === "id_tipo_produto"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome_produto || !form.estoque_minimo || !form.id_tipo_produto) return;

    // Monta payload para o backend
    const payload = {
      ...form,
      estoque_maximo: form.estoque_maximo === "" ? null : form.estoque_maximo,
    };

    const res = await fetch("/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const novoProduto = await res.json();
      setProdutos((prev) => [
        ...prev,
        {
          ...novoProduto,
          stock: stockVisual,
          imagem: form.imagem,
        },
      ]);
      setForm({
        nome_produto: "",
        estoque_minimo: 0,
        estoque_maximo: "",
        id_tipo_produto: tiposProduto[0]?.id_tipo_produto || 1,
        imagem: "",
      });
      setStockVisual("Com");
      toggleModal();
    } else {
      alert("Erro ao cadastrar produto.");
    }
  };

  // ----------- EDIÇÃO -----------
  const openEditModal = (produto: Produto) => {
    setEditForm({
      id_produto: produto.id_produto,
      nome_produto: produto.nome_produto,
      estoque_minimo: produto.estoque_minimo,
      estoque_maximo: produto.estoque_maximo ?? "",
      id_tipo_produto: produto.id_tipo_produto,
      imagem: produto.imagem || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setEditForm((prev) => ({
            ...prev,
            imagem: ev.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "estoque_minimo" || name === "estoque_maximo" || name === "id_tipo_produto"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editForm.id_produto) return;

    const payload = {
      nome_produto: editForm.nome_produto,
      estoque_minimo: editForm.estoque_minimo,
      estoque_maximo: editForm.estoque_maximo === "" ? null : editForm.estoque_maximo,
      id_tipo_produto: editForm.id_tipo_produto,
      imagem: editForm.imagem,
    };

    const res = await fetch(`/api/product/${editForm.id_produto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const produtoAtualizado = await res.json();
      setProdutos((prev) =>
        prev.map((p) =>
          p.id_produto === produtoAtualizado.id_produto
            ? { ...produtoAtualizado, stock: p.stock, imagem: editForm.imagem }
            : p
        )
      );
      setIsEditModalOpen(false);
    } else {
      alert("Erro ao atualizar produto.");
    }
  };

  // Filtro visual
  const produtosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return produtos.filter((p) => {
      const nomeMatch = p.nome_produto.toLowerCase().includes(term);
      const tipoNome = tiposProduto.find(t => t.id_tipo_produto === p.id_tipo_produto)?.nome_tipo_produto || "";
      const tipoMatch = tipoFilter === "Todos" ? true : tipoNome === tipoFilter;
      return nomeMatch && tipoMatch;
    });
  }, [produtos, searchTerm, tipoFilter, tiposProduto]);

  return (
    <div className="catalog-root">
      <Navbar title="Produtos" />

      <main className="catalog-content">
        <h1 className="catalog-title">Catálogo de Produtos</h1>

        <button className="add-button" onClick={toggleModal}>
          + Adicionar Produto
        </button>

        <section className="filters">
          <label>
            <span>Pesquisar Produto</span>
            <input
              placeholder="Nome do produto…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <label>
            <span>Tipo de Produto</span>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {tiposProduto.map((tipo) => (
                <option key={tipo.id_tipo_produto} value={tipo.nome_tipo_produto}>
                  {tipo.nome_tipo_produto}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="cards">
          {produtosFiltrados.map((p) => (
            <article key={p.id_produto} className="flower-card" style={{ position: "relative" }}>
              <button
                onClick={() => handleDeleteProduto(p.id_produto)}
                className="delete-button"
                title="Deletar produto"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "transparent",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                  zIndex: 2,
                }}
              >
                <img src={deletarIcon} alt="Deletar" style={{ width: 18, height: 18 }} />
              </button>
            
              <img
                src={p.imagem || florPadrao}
                alt={p.nome_produto}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              />
            
              <h3 className="flower-name">{p.nome_produto}</h3>
              <p className="flower-category">
                {tiposProduto.find((t) => t.id_tipo_produto === p.id_tipo_produto)?.nome_tipo_produto ||
                  `Tipo #${p.id_tipo_produto}`}
              </p>
              <div className="badges">
                <span className={`badge badge-stock ${p.stock === "Com" ? "in-stock" : "out-stock"}`}>
                  {p.stock === "Com" ? "Estoque" : "Sem Estoque"}
                </span>
              </div>
              <div style={{ fontSize: "0.95rem", marginTop: 4 }}>
                <b>Mín:</b> {p.estoque_minimo}{" "}
                {p.estoque_maximo !== null && (
                  <>
                    <b>Máx:</b> {p.estoque_maximo}
                  </>
                )}
              </div>
              <button
                onClick={() => openEditModal(p)}
                className="save-button"
                style={{ marginTop: 8 }}
              >
                Editar
              </button>
            </article>
          ))}
        </section>
      </main>

      {tiposProduto.length === 0 && (
        <div style={{ color: "#b64c38", fontWeight: 600, margin: "1rem 0", textAlign: "center" }}>
          Cadastre um tipo de produto primeiro em "Gerenciar Tipos de Produto".
        </div>
      )}

      {/* Modal de cadastro */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <header className="modal-header">
              <button className="close-x" onClick={toggleModal}>
                ×
              </button>
              <h2>Adicionar Novo Produto</h2>
            </header>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label>
                <span>Nome do Produto</span>
                <input
                  name="nome_produto"
                  value={form.nome_produto}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Estoque Mínimo</span>
                <input
                  type="number"
                  name="estoque_minimo"
                  value={form.estoque_minimo}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </label>
              <label>
                <span>Estoque Máximo</span>
                <input
                  type="number"
                  name="estoque_maximo"
                  value={form.estoque_maximo}
                  onChange={handleChange}
                  min={0}
                  placeholder="Opcional"
                />
              </label>
              <label>
                <span>Tipo de Produto</span>
                <select
                  name="id_tipo_produto"
                  value={form.id_tipo_produto}
                  onChange={handleChange}
                  required
                >
                  {tiposProduto.map((tipo) => (
                    <option key={tipo.id_tipo_produto} value={tipo.id_tipo_produto}>
                      {tipo.nome_tipo_produto}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Imagem do Produto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
              <button type="submit" className="save-button" disabled={tiposProduto.length === 0}>
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <header className="modal-header">
              <button className="close-x" onClick={() => setIsEditModalOpen(false)}>
                ×
              </button>
              <h2>Editar Produto</h2>
            </header>
            <form className="modal-form" onSubmit={handleEditSubmit}>
              <label>
                <span>Nome do Produto</span>
                <input
                  name="nome_produto"
                  value={editForm.nome_produto}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                <span>Estoque Mínimo</span>
                <input
                  type="number"
                  name="estoque_minimo"
                  value={editForm.estoque_minimo}
                  onChange={handleEditChange}
                  min={0}
                  required
                />
              </label>
              <label>
                <span>Estoque Máximo</span>
                <input
                  type="number"
                  name="estoque_maximo"
                  value={editForm.estoque_maximo}
                  onChange={handleEditChange}
                  min={0}
                  placeholder="Opcional"
                />
              </label>
              <label>
                <span>Tipo de Produto</span>
                <select
                  name="id_tipo_produto"
                  value={editForm.id_tipo_produto}
                  onChange={handleEditChange}
                  required
                >
                  {tiposProduto.map((tipo) => (
                    <option key={tipo.id_tipo_produto} value={tipo.id_tipo_produto}>
                      {tipo.nome_tipo_produto}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Imagem do Produto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditChange}
                />
                {editForm.imagem && (
                  <div style={{ marginTop: 8, textAlign: "center" }}>
                    <img
                      src={editForm.imagem}
                      alt="Imagem atual"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        display: "block",
                        margin: "0 auto 8px auto"
                      }}
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      style={{
                        background: "#eee",
                        color: "#b64c38",
                        border: "none",
                        borderRadius: 4,
                        padding: "0.3rem 0.7rem",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                      onClick={() => setEditForm((prev) => ({ ...prev, imagem: "" }))}
                    >
                      Remover imagem
                    </button>
                  </div>
                )}
              </label>
              <button type="submit" className="save-button">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}