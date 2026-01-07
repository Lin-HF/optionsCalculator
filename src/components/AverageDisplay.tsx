import React from 'react';
import { AverageDisplayProps } from '../types';
import { formatNumber } from '../utils/calculationUtils';
import './AverageDisplay.css';

const AverageDisplay: React.FC<AverageDisplayProps> = ({ value }) => {
  // Format the value with up to 2 decimal places (requirement 7.5)
  const formattedValue = formatNumber(value, 2);

  return (
    <div className="average-display-container">
      <span className="currency-symbol">$</span>
      <div className="average-value">{formattedValue}</div>
    </div>
  );
};

export default AverageDisplay;