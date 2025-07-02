import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import "../styles/CadastroFlores.css";
import Navbar from "../Components/Navebar";

type Condition = "Ótimo" | "Bom" | "Ruim";
type Stock = "Com" | "Sem";

interface Flower {
  id: number;
  name: string;
  category: string;
  condition: Condition;
  stock: Stock;
}

export default function CadastroFlores() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Flower>({
    id: 0,
    name: "",
    category: "",
    condition: "Ótimo",
    stock: "Com",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"Todas" | Condition>(
    "Todas"
  );
  const [stockFilter, setStockFilter] = useState<"Todas" | Stock>("Todas");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value } as Flower);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) return;

    setFlowers((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm({
      id: 0,
      name: "",
      category: "",
      condition: "Ótimo",
      stock: "Com",
    });
    toggleModal();
  };

  const orderedFlowers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const nameActive = term.length > 0;
    const condActive = conditionFilter !== "Todas";
    const stockActive = stockFilter !== "Todas";

    return flowers
      .map((f, i) => ({ f, i }))
      .sort((a, b) => {
        const score = (w: { f: Flower }) => {
          const n = nameActive && w.f.name.toLowerCase().includes(term) ? 1 : 0;
          const c = condActive && w.f.condition === conditionFilter ? 1 : 0;
          const s = stockActive && w.f.stock === stockFilter ? 1 : 0;
          return [n, c, s] as const;
        };
        const sa = score(a);
        const sb = score(b);
        for (let i = 0; i < 3; i++) {
          if (sa[i] !== sb[i]) return sb[i] - sa[i];
        }
        return a.i - b.i;
      })
      .map((w) => w.f);
  }, [flowers, searchTerm, conditionFilter, stockFilter]);

  const conditionClass = (c: Condition) =>
    ("badge-" + (c === "Ótimo" ? "otimo" : c.toLowerCase())) as
      | "badge-otimo"
      | "badge-bom"
      | "badge-ruim";

  return (
    <div className="catalog-root">
      <Navbar title="Flores" />

      <main className="catalog-content">
        <h1 className="catalog-title">Catálogo de Flores</h1>

        <button className="add-button" onClick={toggleModal}>
          + Adicionar Flor
        </button>

        <section className="filters">
          <label>
            <span>Pesquisar Flor</span>
            <input
              placeholder="Nome da flor…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>

          <label>
            <span>Estado</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value as any)}
            >
              <option>Todas</option>
              <option>Ótimo</option>
              <option>Bom</option>
              <option>Ruim</option>
            </select>
          </label>

          <label>
            <span>Estoque</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
            >
              <option>Todas</option>
              <option>Com</option>
              <option>Sem</option>
            </select>
          </label>
        </section>

        <section className="cards">
          {orderedFlowers.map((f) => (
            <article key={f.id} className="flower-card">
              <h3 className="flower-name">{f.name}</h3>
              <p className="flower-category">{f.category}</p>
              <div className="badges">
                <span className={`badge ${conditionClass(f.condition)}`}>
                  {f.condition}
                </span>
                <span
                  className={`badge badge-stock ${
                    f.stock === "Com" ? "in-stock" : "out-stock"
                  }`}
                >
                  {f.stock === "Com" ? "Estoque" : "Sem Estoque"}
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <header className="modal-header">
              <button className="close-x" onClick={toggleModal}>
                ×
              </button>
              <h2>Adicionar Nova Flor</h2>
            </header>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label>
                <span>Nome da Flor</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Tipo de Flor</span>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Estado</span>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                >
                  <option>Ótimo</option>
                  <option>Bom</option>
                  <option>Ruim</option>
                </select>
              </label>
              <label>
                <span>Estoque</span>
                <select name="stock" value={form.stock} onChange={handleChange}>
                  <option>Com</option>
                  <option>Sem</option>
                </select>
              </label>
              <button type="submit" className="save-button">
                Salvar Flor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
