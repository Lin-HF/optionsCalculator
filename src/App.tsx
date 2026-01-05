import { useState } from 'react';
import './App.css';
import { CalculatorColumn } from './components';
import { InputValues, CalculatorGroupConfig } from './types';

function App() {
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

  // Calculator layout configuration for left column (本周五)
  const leftColumnGroups: CalculatorGroupConfig[] = [
    {
      input1Id: 'A1',
      input2Id: 'A2',
      outputs: [
        { id: 'A3', position: 'right', inputs: ['A1', 'A2'] }
      ]
    },
    {
      input1Id: 'A2',
      input2Id: 'C1',
      outputs: [
        { id: 'C2', position: 'left', inputs: ['A2', 'C1'] }
      ]
    },
    {
      input1Id: 'E1',
      input2Id: 'E2',
      outputs: [
        { id: 'E3', position: 'right', inputs: ['E1', 'E2'] }
      ]
    },
    {
      input1Id: 'E1',
      input2Id: 'F1',
      outputs: [
        { id: 'F2', position: 'left', inputs: ['E1', 'F1'] }
      ]
    }
  ];

  // Calculator layout configuration for middle column (下周五)
  const middleColumnGroups: CalculatorGroupConfig[] = [
    {
      input1Id: 'B1',
      input2Id: 'B2',
      outputs: [
        { id: 'B3', position: 'right', inputs: ['B1', 'B2'] }
      ]
    },
    {
      input1Id: 'B2',
      input2Id: 'D1',
      outputs: [
        { id: 'D2', position: 'left', inputs: ['B2', 'D1'] }
      ]
    },
    {
      input1Id: 'H1',
      input2Id: 'H2',
      outputs: [
        { id: 'H3', position: 'right', inputs: ['H1', 'H2'] }
      ]
    },
    {
      input1Id: 'G1',
      input2Id: 'H1',
      outputs: [
        { id: 'G2', position: 'left', inputs: ['G1', 'H1'] }
      ]
    }
  ];

  // Calculator layout configuration for right column (下下周五)
  const rightColumnGroups: CalculatorGroupConfig[] = [
    {
      input1Id: 'I1',
      input2Id: 'I2',
      outputs: [
        { id: 'I3', position: 'right', inputs: ['I1', 'I2'] }
      ]
    },
    {
      input1Id: 'J1',
      input2Id: 'J2',
      outputs: [
        { id: 'J3', position: 'right', inputs: ['J1', 'J2'] }
      ]
    }
  ];

  return (
    <div className="app">
      {/* Three-column layout structure */}
      <div className="app-container">
        {/* Left column - 本周五 */}
        <CalculatorColumn
          weekOffset={0}
          calculatorGroups={leftColumnGroups}
          inputValues={inputValues}
          onValueChange={handleValueChange}
        />
        
        {/* Middle column - 下周五 */}
        <CalculatorColumn
          weekOffset={1}
          calculatorGroups={middleColumnGroups}
          inputValues={inputValues}
          onValueChange={handleValueChange}
        />
        
        {/* Right column - 下下周五 */}
        <CalculatorColumn
          weekOffset={2}
          calculatorGroups={rightColumnGroups}
          inputValues={inputValues}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
}

export default App;