import React, { useState, useEffect } from 'react';
import { PriceInputProps } from '../types';
import './PriceInput.css';

const PriceInput: React.FC<PriceInputProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "0",
  color = "red" // Default to red as per original requirements
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Update input value when prop value changes (from external source)
  useEffect(() => {
    if (!isFocused) {
      if (value === 0) {
        setInputValue('');
      } else {
        setInputValue(value.toFixed(2));
      }
    }
  }, [value, isFocused]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    
    // Handle empty input - treat as 0 (requirement 7.1)
    if (newInputValue === '' || newInputValue === null || newInputValue === undefined) {
      onChange(0);
      return;
    }
    
    // Parse the input value
    const numericValue = parseFloat(newInputValue);
    
    // Handle invalid input - ignore non-numeric values (requirement 7.3)
    if (isNaN(numericValue)) {
      // Don't update the value for invalid input, keep current value
      return;
    }
    
    // Accept all valid numbers including negatives and decimals (requirements 7.3, 7.4)
    onChange(numericValue);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Format the value to 2 decimal places on blur
    const inputVal = event.target.value;
    if (inputVal !== '' && !isNaN(parseFloat(inputVal))) {
      const numericValue = parseFloat(inputVal);
      onChange(numericValue);
      setInputValue(numericValue === 0 ? '' : numericValue.toFixed(2));
    } else if (inputVal === '') {
      onChange(0);
      setInputValue('');
    }
  };

  return (
    <div className="price-input-container">
      <span className="currency-symbol">$</span>
      <input
        type="text"
        id={id}
        className={`price-input price-input--${color}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        inputMode="decimal"
        autoComplete="off"
      />
    </div>
  );
};

export default PriceInput;