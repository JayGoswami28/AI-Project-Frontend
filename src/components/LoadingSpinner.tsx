
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Processing...' }) => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <h5 className="text-muted">{message}</h5>
      <p className="text-muted">AI is analyzing resumes and comparing with job requirements...</p>
    </div>
  );
};

export default LoadingSpinner;
