import React, { useState, useEffect } from "react";
import "../styles/Notificações.css";
import Navbar from "../Components/Navebar";
import deletarIcon from "../assets/deletar.png";
import { useNotificacao } from "../Components/NotificacaoContext";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

type NotificationType = "validade" | "baixo_giro" | "estoque" | "lote_ruim";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  actionText: string;
}

const iconMap: Record<NotificationType, string> = {
  validade: "🕒",
  baixo_giro: "ℹ️",
  estoque: "⚠️",
  lote_ruim: "❗"
};

const NotificationCard: React.FC<{
  notification: Notification;
  onAction: () => void;
}> = ({ notification, onAction }) => {
  const { type, title, description, time } = notification;

  return (
    <div className="card">
      <div className="icon" aria-label={type}>
        {iconMap[type]}
      </div>
      <div className="content">
        <div className="header">
          <span className="title">{title}</span>
          <button className="action-img" onClick={onAction} title="Excluir notificação">
            <img src={deletarIcon} alt="Excluir" style={{ width: 22, height: 22 }} />
          </button>
        </div>
        <div className="description">{description}</div>
        <div className="time">{time}</div>
      </div>
    </div>
  );
};

export const Notificacoes: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { setQuantidade } = useNotificacao();
  const { makeAuthenticatedCall, makeSilentAuthenticatedCall } = useApiErrorHandler();

  const [produtos, setProdutos] = useState<Record<number, string>>({});
  const [lotes, setLotes] = useState<Record<number, string>>({});


  useEffect(() => {
    const loadData = async () => {
      try {
        // Busca produtos - SILENT (no toasts for background loading)
        const produtosRes = await makeSilentAuthenticatedCall("/api/product");
        if (produtosRes.ok) {
          const produtosData = await produtosRes.json();
          const produtosMap: Record<number, string> = {};
          produtosData.forEach((p: any) => { produtosMap[p.id_produto] = p.nome_produto; });
          setProdutos(produtosMap);
        }

        // Busca lotes - SILENT (no toasts for background loading)
        const lotesRes = await makeSilentAuthenticatedCall("/api/lote");
        if (lotesRes.ok) {
          const lotesData = await lotesRes.json();
          const lotesMap: Record<number, string> = {};
          lotesData.forEach((l: any) => { lotesMap[l.id_lote] = l.nome_lote; });
          setLotes(lotesMap);
        }
      } catch (error) {
        // Errors are handled silently for background data loading
      }
    };

    loadData();
  }, [makeSilentAuthenticatedCall]);

  // Busca todos os alertas do backend e atualiza o badge
  useEffect(() => {
    const loadAlertas = async () => {
      setLoading(true);
      try {
        const res = await makeSilentAuthenticatedCall("/api/alert");
        if (res.ok) {
          const data = await res.json();
          const mapped: Notification[] = data.map((alert: any) => {
            let type: NotificationType = "estoque";
            if (alert.tipo_alerta?.toLowerCase().includes("baixo giro")) type = "baixo_giro";
            else if (alert.tipo_alerta?.toLowerCase().includes("validade")) type = "validade";
            else if (alert.tipo_alerta?.toLowerCase().includes("ruim")) type = "lote_ruim";

            return {
              id: alert.id_alerta,
              type,
              title: alert.mensagem || "Alerta",
              description:
                `Produto: ${produtos[alert.id_produto] || `#${alert.id_produto}`}` +
                (alert.id_lote != null
                  ? ` | Lote: ${lotes[alert.id_lote] || `#${alert.id_lote}`}`
                  : " | Sem lote"),
              time: alert.data_hora_alerta
                ? new Date(alert.data_hora_alerta).toLocaleString()
                : "",
              actionText: "Excluir",
            };
          });
          setNotifications(mapped);
          setQuantidade(mapped.length); // Atualiza o badge na Navbar
        }
      } catch (error) {
        // Errors are handled silently for background data loading
        setNotifications([]);
        setQuantidade(0);
      }
      setLoading(false);
    };

    loadAlertas();
  }, [setQuantidade, produtos, lotes, makeSilentAuthenticatedCall]);

  // Deleta um alerta do backend e remove da lista + atualiza badge
  const handleDelete = async (id: number) => {
    try {
      const res = await makeAuthenticatedCall(
        `/api/alert/${id}`,
        {
          method: "DELETE",
        },
        "Notificação removida!"
      );
      
      if (res.ok) {
        setNotifications((prev) => {
          const updated = prev.filter((n) => n.id !== id);
          setQuantidade(updated.length); // Atualiza badge
          return updated;
        });
      }
    } catch (error) {
      // Error is already handled by the API error handler
    }
  };

  // Deleta todos os alertas do backend e limpa a lista + atualiza badge
  const markAllAsRead = async () => {
    try {
      const res = await makeAuthenticatedCall(
        "/api/alert/delete_all",
        {
          method: "DELETE",
        },
        "Todas as notificações foram removidas!"
      );
      
      if (res.ok) {
        setNotifications([]);
        setQuantidade(0); // Atualiza badge
      }
    } catch (error) {
      // Error is already handled by the API error handler
    }
  };

  return (
    <>
      <Navbar title="Notificações" />
      <div className="container" style={{ marginTop: "80px" }}>
        <header className="header">
          <h2>Central de Notificações</h2>
          <button
            className="markAll small"
            onClick={markAllAsRead}
            style={{
              padding: "0.3rem 0.6rem",
              fontSize: "0.7rem",
              borderRadius: "6px",
              marginLeft: "1rem",
              background: "#e2725b",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              height: "40px",
              minWidth: "unset",
              width: "100px"
            }}
          >
            Marcar todas como lidas
          </button>
        </header>

        <div className="list">
          {loading ? (
            <div className="empty">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="empty">Nenhuma notificação.</div>
          ) : (
            notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onAction={() => handleDelete(n.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
