import React, { useEffect, useRef, useState } from "react";
import Chart, { Chart as ChartType } from "chart.js/auto";
import Navbar from "../Components/Navebar";
import "../styles/DashBoardGerente.css";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

/* ---------- Tipagens ---------- */
interface KPI {
  produtosCadastrados: number;
  lotesAtivos: number;
  lotesVencidos: number;
  itensSemGiro: number;
  totalEstoque: number;
}

interface EstadoEstetico {
  [key: string]: number;
}

interface TopFlor {
  nome: string;
  total_saida: number;
}

interface ProdutoEstoque {
  nome: string;
  total: number;
}

interface EstoquePorTipoProduto {
  nome: string;
  total: number;
}

interface LoteProximo {
  id: number;
  flor: string;
  diasRestantes: number;
  quantidade: number;
}

/* ---------- Componente ---------- */
const DashboardGerente: React.FC = () => {
  const { makeAuthenticatedCall } = useApiErrorHandler();
  const [kpi, setKPI] = useState<KPI | null>(null);
  const [estadoEstetico, setEstadoEstetico] = useState<EstadoEstetico | null>(null);
  const [topFlores, setTopFlores] = useState<TopFlor[]>([]);
  const [produtosEstoque, setProdutosEstoque] = useState<ProdutoEstoque[]>([]);
  const [estoquePorTipo, setEstoquePorTipo] = useState<EstoquePorTipoProduto[]>([]);
  const [lotes, setLotes] = useState<LoteProximo[]>([]);

  const estadoEsteticoRef = useRef<HTMLCanvasElement | null>(null);
  const topFloresRef = useRef<HTMLCanvasElement | null>(null);
  const estoquePorProdutoRef = useRef<HTMLCanvasElement | null>(null);

  const estadoChart = useRef<ChartType | null>(null);
  const topFloresChart = useRef<ChartType | null>(null);
  const estoqueChart = useRef<ChartType | null>(null);

  // Estados para gráfico de lote específico
  const [loteSelecionado, setLoteSelecionado] = useState<number | "">("");
  const [estadosLote, setEstadosLote] = useState<{ [key: string]: number }>({});
  const loteEstadosChartRef = useRef<ChartType | null>(null);
  const loteEstadosCanvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ---------- Carrega dados do back‑end ---------- */
  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await makeAuthenticatedCall("/api/dashboard-gerente");
        if (res.ok) {
          const data = await res.json();
          setKPI(data.kpi);
          setEstadoEstetico(data.estadoEstetico);
          setTopFlores(data.topFlores);
          setLotes(data.lotesProximos);
          setProdutosEstoque(data.produtosEstoque);
          setEstoquePorTipo(data.estoquePorTipoProduto || []);
        }
      } catch (err) {
        // Error is handled by the API error handler
      }
    }

    fetchDados();
  }, [makeAuthenticatedCall]);

  // Busca estados estéticos do lote selecionado
  useEffect(() => {
    async function fetchEstadosLote() {
      if (loteSelecionado !== "" && loteSelecionado !== null) {
        try {
          const res = await makeAuthenticatedCall(`/api/dashboard/lote-estados?lote_id=${loteSelecionado}`);
          if (res.ok) {
            const data = await res.json();
            setEstadosLote(data);
          }
        } catch (error) {
          // Error is handled by the API error handler
          setEstadosLote({});
        }
      } else {
        setEstadosLote({});
      }
    }

    fetchEstadosLote();
  }, [loteSelecionado, makeAuthenticatedCall]);

  // Gráfico de Estado Estético Geral
  useEffect(() => {
    if (estadoEsteticoRef.current && estadoEstetico) {
      estadoChart.current?.destroy();
      const labels = Object.keys(estadoEstetico);
      const dataValues = Object.values(estadoEstetico);
      estadoChart.current = new Chart(estadoEsteticoRef.current, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: dataValues,
              backgroundColor: [
                "rgba(59,130,246,0.7)",
                "rgba(234,179,8,0.7)",
                "rgba(239,68,68,0.7)",
                "rgba(94,124,91,0.7)",
                "rgba(255,99,132,0.7)",
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          plugins: { legend: { position: "bottom" } },
          responsive: true,
        },
      });
    }
    return () => estadoChart.current?.destroy();
  }, [estadoEstetico]);

  // Gráfico Top 5 Flores
  useEffect(() => {
    if (topFloresRef.current) {
      topFloresChart.current?.destroy();
      if (topFlores.length > 0) {
        topFloresChart.current = new Chart(topFloresRef.current, {
          type: "bar",
          data: {
            labels: topFlores.map((f) => f.nome),
            datasets: [
              {
                label: "Unidades Vendidas",
                data: topFlores.map((f) => f.total_saida),
                backgroundColor: "rgba(94,124,91,0.7)",
                borderColor: "rgba(94,124,91,1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } },
          },
        });
      }
    }
    return () => topFloresChart.current?.destroy();
  }, [topFlores]);

  // Gráfico Estoque por Produto
  useEffect(() => {
    if (estoquePorProdutoRef.current && produtosEstoque.length) {
      estoqueChart.current?.destroy();
      estoqueChart.current = new Chart(estoquePorProdutoRef.current, {
        type: "bar",
        data: {
          labels: produtosEstoque.map((p) => p.nome),
          datasets: [
            {
              label: "Total em Estoque",
              data: produtosEstoque.map((p) => p.total),
              backgroundColor: "rgba(59,130,246,0.7)",
              borderColor: "rgba(59,130,246,1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Estoque por Produto" },
          },
          scales: { y: { beginAtZero: true } },
        },
      });
    }
    return () => estoqueChart.current?.destroy();
  }, [produtosEstoque]);

  // Gráfico Estados Estéticos do Lote Selecionado (atualiza só esse gráfico)
  useEffect(() => {
    if (loteEstadosCanvasRef.current && Object.keys(estadosLote).length > 0) {
      loteEstadosChartRef.current?.destroy();
      loteEstadosChartRef.current = new Chart(loteEstadosCanvasRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(estadosLote),
          datasets: [
            {
              label: "Itens movimentados",
              data: Object.values(estadosLote),
              backgroundColor: [
                "rgba(239,68,68,0.7)",
                "rgba(234,179,8,0.7)",
                "rgba(59,130,246,0.7)",
              ],
              borderColor: [
                "rgba(239,68,68,1)",
                "rgba(234,179,8,1)",
                "rgba(59,130,246,1)",
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          indexAxis: "y",
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Movimentação por Estado Estético",
              font: { size: 18 }
            },
          },
          scales: {
            x: { beginAtZero: true, title: { display: true, text: "Quantidade" } },
            y: { title: { display: true, text: "Estado Estético" } }
          },
          responsive: true,
        },
      });
    }
    return () => loteEstadosChartRef.current?.destroy();
  }, [estadosLote]);

  /* ---------- Render ---------- */
  return (
    <>
      <Navbar title='Dashboard' />

      <div className='dashboard-container'>
        {/* KPIs */}
        <div className='kpi-grid'>
          <div className='kpi-card'>
            <h3>Produtos Cadastrados</h3>
            <p>{kpi ? kpi.produtosCadastrados : "—"}</p>
          </div>
          <div className='kpi-card'>
            <h3>Lotes Ativos</h3>
            <p>{kpi ? kpi.lotesAtivos : "—"}</p>
          </div>
          <div className='kpi-card'>
            <h3>Lotes Vencidos</h3>
            <p className='text-red'>{kpi ? kpi.lotesVencidos : "—"}</p>
          </div>
          <div className='kpi-card'>
            <h3>Itens sem Giro</h3>
            <p className='text-yellow'>{kpi ? kpi.itensSemGiro : "—"}</p>
          </div>
          <div className='kpi-card'>
            <h3>Total em Estoque</h3>
            <p>{kpi ? kpi.totalEstoque : "—"}</p>
          </div>
          <div className='kpi-card'>
            <h3>Estoque por Tipo</h3>
            {estoquePorTipo.length === 0 ? (
              <p>—</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {estoquePorTipo.map((t) => (
                  <li key={t.nome}>
                    <b>{t.nome}:</b> {t.total}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Gráficos */}
        <div className='charts-grid'>
          <div className='chart-card'>
            <h3>Lotes por Estado Predominante</h3>
            <canvas ref={estadoEsteticoRef} />
          </div>
          <div className='chart-card'>
            <h3>Top 5 Flores (Saídas no Mês)</h3>
            {topFlores.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: 40 }}>Sem dados para o mês atual.</p>
            ) : (
              <canvas ref={topFloresRef} />
            )}
          </div>
          <div className='chart-card'>
            <h3>Estoque por Produto</h3>
            <canvas ref={estoquePorProdutoRef} />
          </div>
          <div className='chart-card'>
            <h3>Movimentação por Estado Estético do Lote</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <label htmlFor="lote-select" style={{ fontWeight: 500, fontSize: 14 }}>
                Escolha o lote:
              </label>
              <select
                id="lote-select"
                value={loteSelecionado}
                onChange={e => setLoteSelecionado(e.target.value === "" ? "" : Number(e.target.value))}
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 12,
                  fontFamily: "Arial",
                  minWidth: 160,
                  background: "#f9f9f9",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  outline: "none",
                  transition: "border 0.2s"
                }}
              >
                <option value="">Selecione o lote</option>
                {lotes.map(l => (
                  <option key={l.id} value={l.id}>
                    {`Lote #${l.id} (${l.flor})`}
                  </option>
                ))}
              </select>
            </div>
            {loteSelecionado && Object.keys(estadosLote).length > 0 ? (
              <canvas ref={loteEstadosCanvasRef} />
            ) : (
              <p style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
                Selecione um lote para visualizar a movimentação por estado estético.
              </p>
            )}
          </div>
        </div>

        {/* Lotes próximos da validade */}
        <div className='lotes-list'>
          <h3>Lotes com Validade Próxima</h3>
          <ul>
            {lotes.map((lote) => (
              <li key={lote.id}>
                <span>
                  Lote #{lote.id} ({lote.flor})
                </span>
                <span
                  className={
                    lote.diasRestantes <= 2 ? "vence-red" : "vence-yellow"
                  }
                >
                  Vence em {lote.diasRestantes}{" "}
                  {lote.diasRestantes === 1 ? "dia" : "dias"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardGerente;    