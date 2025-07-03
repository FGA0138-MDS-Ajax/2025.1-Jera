import React from 'react';
import styles from './NotificationCard.module.css';

export type NotificationType = 'validade' | 'promocao' | 'estoque';

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  actionText: string;
  onAction: () => void;
}

const iconMap = {
  validade: '🕒',
  promocao: 'ℹ️',
  estoque: '⚠️',
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  title,
  description,
  time,
  actionText,
  onAction,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon} aria-label={type}>{iconMap[type]}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.action} onClick={onAction}>{actionText}</button>
        </div>
        <div className={styles.description}>{description}</div>
        <div className={styles.time}>{time}</div>
      </div>
    </div>
  );
}; 