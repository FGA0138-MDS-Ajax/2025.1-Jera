import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './LoadingSpinner.css';

interface FullPageLoadingProps {
  text?: string;
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  text = 'Carregando...' 
}) => {
  return (
    <div className="full-page-loading">
      <div className="loading-content">
        <LoadingSpinner size="large" color="#3498db" />
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default FullPageLoading;
