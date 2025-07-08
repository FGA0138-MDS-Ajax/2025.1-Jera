import React, { useState, useEffect } from "react";
import "../styles/Notificações.css";
import Navbar from "../Components/Navebar";
import deletarIcon from "../assets/deletar.png";
import { useNotificacao } from "../Components/NotificacaoContext";

type NotificationType = "validade" | "promocao" | "estoque";

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
  promocao: "ℹ️",
  estoque: "⚠️",
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

  const [produtos, setProdutos] = useState<Record<number, string>>({});
  const [lotes, setLotes] = useState<Record<number, string>>({});


  useEffect(() => {
  // Busca produtos
  fetch("/api/product")
    .then(res => res.json())
    .then((data) => {
      const map: Record<number, string> = {};
      data.forEach((p: any) => { map[p.id_produto] = p.nome_produto; });
      setProdutos(map);
    });

  // Busca lotes
  fetch("/api/lote")
    .then(res => res.json())
    .then((data) => {
      const map: Record<number, string> = {};
      data.forEach((l: any) => { map[l.id_lote] = l.nome_lote; });
      setLotes(map);
    });
}, []);

  // Busca todos os alertas do backend e atualiza o badge
  useEffect(() => {
    setLoading(true);
    fetch("/api/alert")
      .then(res => res.json())
      .then(data => {
        const mapped: Notification[] = data.map((alert: any) => ({
          id: alert.id_alerta,
          type: "estoque", // ajuste conforme o tipo do alerta se houver
          title: alert.mensagem || "Alerta de Estoque",
          description: `Produto: ${produtos[alert.id_produto] || `#${alert.id_produto}`} | ${lotes[alert.id_lote] || `#${alert.id_lote}`}`,
          time: alert.data_hora_alerta
            ? new Date(alert.data_hora_alerta).toLocaleString()
            : "",
          actionText: "Excluir",
        }));
        setNotifications(mapped);
        setQuantidade(mapped.length); // Atualiza o badge na Navbar
      })
      .catch(() => {
        setNotifications([]);
        setQuantidade(0);
      })
      .finally(() => setLoading(false));
  }, [setQuantidade, produtos, lotes]);

  // Deleta um alerta do backend e remove da lista + atualiza badge
  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/alert/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        setQuantidade(updated.length); // Atualiza badge
        return updated;
      });
    } else {
      alert("Erro ao excluir alerta.");
    }
  };

  // Deleta todos os alertas do backend e limpa a lista + atualiza badge
  const markAllAsRead = async () => {
    await fetch("/api/alert/delete_all", { method: "DELETE" });
    setNotifications([]);
    setQuantidade(0); // Atualiza badge
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
