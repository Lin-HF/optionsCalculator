import React from 'react';
import { ValidationError } from '../types';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: ValidationError | null;
  position: { x: number; y: number };
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, position }) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className="error-display"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10
      }}
      data-testid={`error-${error.pairId}`}
    >
      <div className="error-message">
        {error.message}
      </div>
    </div>
  );
};

export default ErrorDisplay;
