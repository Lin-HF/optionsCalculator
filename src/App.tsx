import { useState } from 'react';
import './App.css';
import { CalculatorColumn } from './components';
import { InputValues } from './types';
import { 
  validateConfiguration
} from './config/calculatorConfig';

function App() {
  // Validate configuration on app initialization
  validateConfiguration();

  // Global state management for all input values
  const [inputValues, setInputValues] = useState<InputValues>({
    // Left column (本周五)
    A1: 0,
    A2: 0,
    C1: 0,
    E1: 0,
    E2: 0,
    F1: 0,
    
    // Middle column (下周五)
    B1: 0,
    B2: 0,
    D1: 0,
    G1: 0,
    H1: 0,
    H2: 0,
    
    // Right column (下下周五)
    I1: 0,
    I2: 0,
    J1: 0,
    J2: 0,
  });

  // Handle state updates and propagation
  const handleValueChange = (id: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Format current date for display
  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="app">
      {/* Current date display in top left corner */}
      <div className="current-date">
        {getCurrentDate()}
      </div>
      
      {/* Three-column layout structure */}
      <div className="app-container">
        {/* Left column - 本周五 */}
        <CalculatorColumn
          weekOffset={0}
          columnIndex={0}
          inputValues={inputValues}
          onValueChange={handleValueChange}
        />
        
        {/* Middle column - 下周五 */}
        <CalculatorColumn
          weekOffset={1}
          columnIndex={1}
          inputValues={inputValues}
          onValueChange={handleValueChange}
        />
        
        {/* Right column - 下下周五 */}
        <CalculatorColumn
          weekOffset={2}
          columnIndex={2}
          inputValues={inputValues}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
}

export default App;