import React, { useEffect, useRef, useState } from "react";
import Chart, { Chart as ChartType } from "chart.js/auto";
import Navbar from "../Components/Navebar";
import "../styles/DashBoardGerente.css";

/* ---------- Tipagens ---------- */
interface KPI {
  lotesAtivos: number;
  itensSemGiro: number;
}

interface EstadoEstetico {
  otimo: number;
  regular: number;
  ruim: number;
}

interface TopFlor {
  nome: string;
  vendidas: number;
}

interface LoteProximo {
  id: number;
  flor: string;
  diasRestantes: number;
}

/* ---------- Componente ---------- */
const DashboardGerente: React.FC = () => {
  const [kpi, setKPI] = useState<KPI | null>(null);
  const [estadoEstetico, setEstadoEstetico] = useState<EstadoEstetico | null>(
    null
  );
  const [topFlores, setTopFlores] = useState<TopFlor[]>([]);
  const [lotes, setLotes] = useState<LoteProximo[]>([]);

  const estadoEsteticoRef = useRef<HTMLCanvasElement | null>(null);
  const topFloresRef = useRef<HTMLCanvasElement | null>(null);

  const estadoChart = useRef<ChartType>();
  const topFloresChart = useRef<ChartType>();

  /* ---------- Carrega dados do back‑end ---------- */
  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch("/api/dashboard-gerente");
        const data = await res.json();

        setKPI({
          lotesAtivos: data.kpi.lotesAtivos,
          itensSemGiro: data.kpi.itensSemGiro,
        });
        setEstadoEstetico(data.estadoEstetico);
        setTopFlores(data.topFlores);
        setLotes(data.lotesProximos);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
      }
    }

    fetchDados();
  }, []);

  /* ---------- Desenha/atualiza os gráficos ---------- */
  useEffect(() => {
    if (estadoEsteticoRef.current && estadoEstetico) {
      estadoChart.current?.destroy();
      estadoChart.current = new Chart(estadoEsteticoRef.current, {
        type: "doughnut",
        data: {
          labels: ["Ótimo", "Regular", "Ruim"],
          datasets: [
            {
              data: [
                estadoEstetico.otimo,
                estadoEstetico.regular,
                estadoEstetico.ruim,
              ],
              backgroundColor: [
                "rgba(59,130,246,0.7)",
                "rgba(234,179,8,0.7)",
                "rgba(239,68,68,0.7)",
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

    if (topFloresRef.current && topFlores.length) {
      topFloresChart.current?.destroy();
      topFloresChart.current = new Chart(topFloresRef.current, {
        type: "bar",
        data: {
          labels: topFlores.map((f) => f.nome),
          datasets: [
            {
              label: "Unidades Vendidas",
              data: topFlores.map((f) => f.vendidas),
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

    return () => {
      estadoChart.current?.destroy();
      topFloresChart.current?.destroy();
    };
  }, [estadoEstetico, topFlores]);

  /* ---------- Render ---------- */
  return (
    <>
      {/* Navbar agora fora da caixa do dashboard-container */}
      <Navbar title="Dashboard" />

      <div className="dashboard-container">
        {/* KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <h3>Lotes Ativos</h3>
            <p>{kpi ? kpi.lotesAtivos : "—"}</p>
          </div>

          <div className="kpi-card">
            <h3>Itens sem Giro</h3>
            <p className="text-yellow">{kpi ? kpi.itensSemGiro : "—"}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Estado Estético Geral</h3>
            <canvas ref={estadoEsteticoRef} />
          </div>

          <div className="chart-card">
            <h3>Top 5 Flores (Saídas no Mês)</h3>
            <canvas ref={topFloresRef} />
          </div>
        </div>

        {/* Lotes próximos da validade */}
        <div className="lotes-list">
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
