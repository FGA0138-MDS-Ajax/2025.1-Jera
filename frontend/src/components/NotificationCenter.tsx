import React, { useState } from 'react';
import { NotificationCard, NotificationType } from './NotificationCard';
import styles from './NotificationCenter.module.css';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  actionText: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'validade',
    title: 'Validade Próxima',
    description: 'O lote 123 de Lírios Brancos vence em 3 dias.',
    time: 'há 2 horas',
    actionText: 'Ver Detalhes',
  },
  {
    id: 2,
    type: 'promocao',
    title: 'Sugestão de Promoção',
    description: 'O produto Girassol não tem saídas há 30 dias. Considere criar uma promoção.',
    time: 'ontem',
    actionText: 'Ver Produto',
  },
  {
    id: 3,
    type: 'estoque',
    title: 'Estoque Baixo',
    description: 'O item Rosa Vermelha está abaixo do estoque mínimo definido (3/10).',
    time: 'há 5 minutos',
    actionText: 'Verificar Estoque',
  },
];

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications([]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Central de Notificações</h2>
        <button className={styles.markAll} onClick={markAllAsRead}>
          Marcar todas como lidas
        </button>
      </header>
      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>Nenhuma notificação.</div>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              type={n.type}
              title={n.title}
              description={n.description}
              time={n.time}
              actionText={n.actionText}
              onAction={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}; 