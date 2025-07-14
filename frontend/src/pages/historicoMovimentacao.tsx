import { useEffect, useState } from "react";
import Navbar from "../Components/Navebar";
import "../styles/HistoricoMovimentacao.css";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

interface Movimentacao {
  id_movimentacao: number;
  id_produto: number;
  nome_produto: string;
  id_lote: number;
  nome_lote: string;
  tipo_movimentacao: boolean; // true = entrada, false = saída
  quantidade: number;
  data_movimentacao: string;
  estado_estetico: string;
  usuario_email: string;
  perfil: string;
}

export default function HistoricoMovimentacoes() {
  const { makeAuthenticatedCall } = useApiErrorHandler();
  const [movs, setMovs] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  const estadosEsteticos: Record<number, string> = {
    1: "Ruim",
    2: "Regular",
    3: "Bom",
    };

  useEffect(() => {
    const loadMovimentacoes = async () => {
      try {
        const res = await makeAuthenticatedCall("/api/movimentacao");
        if (res.ok) {
          const data = await res.json();
          
          interface MovimentacaoApi {
            id_movimentacao: number;
            id_produto: number;
            nome_produto?: string;
            id_lote: number;
            nome_lote?: string;
            tipo_movimentacao: boolean;
            quantidade: number;
            data_movimentacao: string;
            id_estado_estetico: number;
            usuario_email?: string;
            perfil?: string;
          }

          const ordenados: Movimentacao[] = (data as MovimentacaoApi[])
            .map((m: MovimentacaoApi): Movimentacao => ({
              id_movimentacao: m.id_movimentacao,
              id_produto: m.id_produto,
              nome_produto: m.nome_produto || `Produto #${m.id_produto}`,
              id_lote: m.id_lote,
              nome_lote: m.nome_lote || `Lote #${m.id_lote}`,
              tipo_movimentacao: m.tipo_movimentacao,
              quantidade: m.quantidade,
              data_movimentacao: m.data_movimentacao,
              estado_estetico: estadosEsteticos[m.id_estado_estetico] || "-",
              usuario_email: m.usuario_email || "-",
              perfil: m.perfil || "-",
            }))
            .sort(
              (a: Movimentacao, b: Movimentacao) =>
                new Date(b.data_movimentacao).getTime() -
                new Date(a.data_movimentacao).getTime()
            )
            .slice(0, 35);
            setMovs(ordenados);
        }
      } catch (error) {
        // Error is handled by the API error handler
      }
      setLoading(false);
    };

    loadMovimentacoes();
  }, [makeAuthenticatedCall]);

  // Permissão: só ADMINISTRADOR pode ver
  const perfil = localStorage.getItem("perfil");
  if (perfil !== "ADMINISTRADOR") {
    return (
      <>
        <Navbar title="Histórico de Movimentações" />
        <div className="historico-acesso-negado">
          Acesso restrito apenas para administradores.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Histórico de Movimentações" />
      <div className="historico-container">
        <h2 className="historico-titulo">Histórico Completo de Movimentações</h2>
        {loading ? (
          <div className="historico-loading">Carregando...</div>
        ) : movs.length === 0 ? (
          <div className="historico-vazio">Nenhuma movimentação registrada.</div>
        ) : (
          <div className="historico-tabela-wrapper">
            <table className="historico-tabela">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Lote</th>
                  <th>Quantidade</th>
                  <th>Estado Estético</th>
                  <th>Email</th>
                  <th>Perfil</th>
                </tr>
              </thead>
              <tbody>
                {movs.map((m) => (
                  <tr key={m.id_movimentacao}>
                    <td>{new Date(m.data_movimentacao).toLocaleString()}</td>
                    <td className={m.tipo_movimentacao ? "entrada" : "saida"}>
                      {m.tipo_movimentacao ? "Entrada" : "Saída"}
                    </td>
                    <td>{m.nome_produto}</td>
                    <td>{m.nome_lote}</td>
                    <td className="quantidade">{m.quantidade}</td>
                    <td>{m.estado_estetico}</td>
                    <td>{m.usuario_email}</td>
                    <td>{m.perfil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}