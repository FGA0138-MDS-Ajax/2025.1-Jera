import React, { useEffect } from 'react';
import './Alert.css';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'i';
    }
  };

  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Fechar">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
