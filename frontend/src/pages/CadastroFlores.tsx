import { useState, useEffect, useMemo } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "../styles/CadastroFlores.css";
import Navbar from "../Components/Navebar";
import deletarIcon from "../assets/deletar.png";
import florPadrao from "../assets/LogoFloraGest.png";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

interface Produto {
  id_produto: number;
  nome_produto: string;
  estoque_minimo: number;
  estoque_maximo?: number | null;
  id_tipo_produto: number;
  tipo_produto_nome?: string;
  stock?: "Com" | "Sem";
}

interface ProdutoForm {
  nome_produto: string;
  estoque_minimo: number;
  estoque_maximo?: number | "";
  id_tipo_produto: number;
}

interface TipoProduto {
  id_tipo_produto: number;
  nome_tipo_produto: string;
}

export default function CadastroFlores() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [tiposProduto, setTiposProduto] = useState<TipoProduto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { makeAuthenticatedCall } = useApiErrorHandler();
  const [form, setForm] = useState<ProdutoForm>({
    nome_produto: "",
    estoque_minimo: 0,
    estoque_maximo: "",
    id_tipo_produto: 1,
  });

  // Modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProdutoForm & { id_produto?: number }>({
    nome_produto: "",
    estoque_minimo: 0,
    estoque_maximo: "",
    id_tipo_produto: 1,
  });

  // Visual: Stock "Com" ou "Sem" (não enviado ao backend)
  const [, setStockVisual] = useState<"Com" | "Sem">("Com");
  
  // token de verificação
  const token = localStorage.getItem("token");
  const perfil = localStorage.getItem("perfil");

  // Filtros visuais
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  const handleDeleteProduto = async (id_produto: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;
    try {
      const res = await makeAuthenticatedCall(
        `/api/product/${id_produto}`, 
        { method: "DELETE" },
        "Produto deletado com sucesso!"
      );
      if (res.ok) {
        setProdutos((prev) => prev.filter((p) => p.id_produto !== id_produto));
      }
    } catch (error) {
      // Error is already handled by the API error handler
    }
  };

  // Buscar produtos do backend
  useEffect(() => {
    fetch("/api/product", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(async(data) => {
        // Para cada produto, busca o estoque atual
      const produtosComEstoque = await Promise.all(
        data.map(async (p: Produto) => {
          try {
            const resEstoque = await fetch(`/api/movimentacao/estoque_atual/${p.id_produto}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
            const estoqueData = await resEstoque.json();
            return {
              ...p,
              stock: estoqueData.estoque_atual > 0 ? "Com" : "Sem",
            };
          } catch {
            return { ...p, stock: "Sem" };
          }
        })
      );
      setProdutos(produtosComEstoque);
    });
}, []);

  // Buscar tipos de produto do backend
  useEffect(() => {
    fetch("/api/product_type", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTiposProduto(data);
      });
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "estoque_minimo" || name === "estoque_maximo" || name === "id_tipo_produto"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  // --------- FORM SUBMIT -----------

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome_produto || !form.estoque_minimo || !form.id_tipo_produto) return;

    try {
      const res = await makeAuthenticatedCall(
        "/api/product",
        {
          method: "POST",
          body: JSON.stringify({
            nome_produto: form.nome_produto,
            estoque_minimo: form.estoque_minimo,
            estoque_maximo: form.estoque_maximo === "" ? null : form.estoque_maximo,
            id_tipo_produto: form.id_tipo_produto,
          }),
        },
        "Produto cadastrado com sucesso!"
      );

      if (res.ok) {
        const novoProduto = await res.json();
        setProdutos((prev) => [
          ...prev,
          {
            ...novoProduto,
            stock: "Sem",
          },
        ]);
        setForm({
          nome_produto: "",
          estoque_minimo: 0,
          estoque_maximo: "",
          id_tipo_produto: tiposProduto[0]?.id_tipo_produto || 1,
        });
        setStockVisual("Com");
        toggleModal();
      }
    } catch (error) {
      // Error is already handled by the API error handler
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
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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

    try {
      const res = await makeAuthenticatedCall(
        `/api/product/${editForm.id_produto}`,
        {
          method: "PUT",
          body: JSON.stringify({
            nome_produto: editForm.nome_produto,
            estoque_minimo: editForm.estoque_minimo,
            estoque_maximo: editForm.estoque_maximo === "" ? null : editForm.estoque_maximo,
            id_tipo_produto: editForm.id_tipo_produto,
          }),
        },
        "Produto atualizado com sucesso!"
      );

      if (res.ok) {
        const produtoAtualizado = await res.json();
        setProdutos((prev) =>
          prev.map((p) =>
            p.id_produto === produtoAtualizado.id_produto
              ? { ...produtoAtualizado, stock: p.stock }
              : p
          )
        );
        setIsEditModalOpen(false);
      }
    } catch (error) {
      // Error is already handled by the API error handler
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

  // Permissão: só ADMINISTRADOR pode cadastrar/editar/deletar
  const isAdmin = perfil === "ADMINISTRADOR";

  return (
    <div className="catalog-root">
      <Navbar title="Produtos" />

      <main className="catalog-content">
        <h1 className="catalog-title">Catálogo de Produtos</h1>

        {isAdmin && (
          <button className="add-button" onClick={toggleModal}>
            + Adicionar Produto
          </button>
        )}

        {/* Filtros de pesquisa */}
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
              {isAdmin && (
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
              )}

              <img
                src={florPadrao}
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
              {isAdmin && (
                <button
                  onClick={() => openEditModal(p)}
                  className="save-button"
                  style={{ marginTop: 8 }}
                >
                  Editar
                </button>
              )}
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
      {isModalOpen && isAdmin && (
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
              <button type="submit" className="save-button" disabled={tiposProduto.length === 0}>
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {isEditModalOpen && isAdmin && (
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