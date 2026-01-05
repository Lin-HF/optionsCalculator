import React, { useState } from 'react';
import './App.css';
import { CalculatorGroup } from './components';
import { OutputConfig } from './types';

function App() {
  // Temporary state to demonstrate the CalculatorGroup component
  const [inputValues, setInputValues] = useState<Record<string, number>>({
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0
  });

  const handleValueChange = (id: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Example calculator group configurations
  const exampleOutputs1: OutputConfig[] = [
    {
      id: 'A3',
      position: 'right',
      inputs: ['A1', 'A2']
    }
  ];

  const exampleOutputs2: OutputConfig[] = [
    {
      id: 'B3',
      position: 'right',
      inputs: ['B1', 'B2']
    }
  ];

  return (
    <div className="app">
      <h1>Price Calculator - CalculatorGroup Demo</h1>
      <p>This is a temporary demo of the CalculatorGroup component:</p>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <div>
          <h3>Calculator Group 1 (A1 + A2 = A3)</h3>
          <CalculatorGroup
            input1Id="A1"
            input2Id="A2"
            outputs={exampleOutputs1}
            onValueChange={handleValueChange}
            inputValues={inputValues}
          />
        </div>
        
        <div>
          <h3>Calculator Group 2 (B1 + B2 = B3)</h3>
          <CalculatorGroup
            input1Id="B1"
            input2Id="B2"
            outputs={exampleOutputs2}
            onValueChange={handleValueChange}
            inputValues={inputValues}
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Current Values:</h4>
        <pre>{JSON.stringify(inputValues, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App