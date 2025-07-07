import React, { useState, useEffect } from "react";
import "../styles/Notificações.css";
import Navbar from "../Components/Navebar";

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
  const { type, title, description, time, actionText } = notification;

  return (
    <div className="card">
      <div className="icon" aria-label={type}>
        {iconMap[type]}
      </div>
      <div className="content">
        <div className="header">
          <span className="title">{title}</span>
          <button className="action" onClick={onAction}>
            {actionText}
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

  // Aqui você pode usar useEffect para buscar notificações do backend
  // useEffect(() => {
  //   fetch("/api/notificacoes")
  //     .then(res => res.json())
  //     .then(data => setNotifications(data))
  //     .catch(console.error);
  // }, []);

  const markAllAsRead = () => setNotifications([]);

  return (
    <>
      <Navbar title="Notificações" />
      <div className="container" style={{ marginTop: "80px" }}>
        <header className="header">
          <h2>Central de Notificações</h2>
          <button className="markAll" onClick={markAllAsRead}>
            Marcar todas como lidas
          </button>
        </header>

        <div className="list">
          {notifications.length === 0 ? (
            <div className="empty">Nenhuma notificação.</div>
          ) : (
            notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onAction={() => alert(`Ação para: ${n.title}`)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
