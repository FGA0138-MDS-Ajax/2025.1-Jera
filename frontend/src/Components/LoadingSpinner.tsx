import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#3498db' 
}) => {
  const sizeMap = {
    small: '1rem',
    medium: '2rem',
    large: '4rem'
  };

  return (
    <div className="loading-spinner" style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <svg viewBox="0 0 50 50" className="spinner-svg">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          style={{ stroke: color }}
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
