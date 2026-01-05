import React from 'react';
import { AverageDisplayProps } from '../types';
import { formatNumber } from '../utils/calculationUtils';
import './AverageDisplay.css';

const AverageDisplay: React.FC<AverageDisplayProps> = ({ value, label }) => {
  // Format the value with up to 2 decimal places (requirement 7.5)
  const formattedValue = formatNumber(value, 2);

  return (
    <div className="average-display" data-output-id={label}>
      <span className="average-label">{label}:</span>
      <span className="average-value">{formattedValue}</span>
    </div>
  );
};

export default AverageDisplay;