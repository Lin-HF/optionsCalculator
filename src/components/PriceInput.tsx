import React from 'react';
import { PriceInputProps } from '../types';
import './PriceInput.css';

const PriceInput: React.FC<PriceInputProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "0",
  color = "red" // Default to red as per original requirements
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Handle empty input - treat as 0 (requirement 7.1)
    if (inputValue === '' || inputValue === null || inputValue === undefined) {
      onChange(0);
      return;
    }
    
    // Parse the input value
    const numericValue = parseFloat(inputValue);
    
    // Handle invalid input - ignore non-numeric values (requirement 7.3)
    if (isNaN(numericValue)) {
      // Don't update the value for invalid input, keep current value
      return;
    }
    
    // Accept all valid numbers including negatives and decimals (requirements 7.3, 7.4)
    onChange(numericValue);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Ensure the displayed value matches the actual numeric value
    // This handles cases where user enters something like "5." or "5.00"
    const inputValue = event.target.value;
    if (inputValue !== '' && !isNaN(parseFloat(inputValue))) {
      const numericValue = parseFloat(inputValue);
      if (numericValue !== value) {
        onChange(numericValue);
      }
    }
  };

  return (
    <div className="price-input-container">
      <span className="currency-symbol">$</span>
      <input
        type="text"
        id={id}
        className={`price-input price-input--${color}`}
        value={value === 0 ? '' : value.toString()}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        inputMode="decimal"
        autoComplete="off"
      />
    </div>
  );
};

export default PriceInput;