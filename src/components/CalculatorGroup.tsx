import React from 'react';
import { CalculatorGroupProps } from '../types';
import { calculateAverage } from '../utils/calculationUtils';
import PriceInput from './PriceInput';
import AverageDisplay from './AverageDisplay';
import './CalculatorGroup.css';

interface CalculatorGroupPropsWithValues extends CalculatorGroupProps {
  inputValues?: Record<string, number>;
}

const CalculatorGroup: React.FC<CalculatorGroupPropsWithValues> = ({
  input1Id,
  input2Id,
  outputs,
  onValueChange,
  inputValues = {}
}) => {
  const getInputValue = (id: string): number => {
    return inputValues[id] || 0;
  };

  const handleInputChange = (id: string, value: number) => {
    onValueChange(id, value);
  };

  const calculateOutputValue = (inputIds: string[]): number => {
    if (inputIds.length !== 2) {
      console.warn(`Expected 2 inputs for calculation, got ${inputIds.length}`);
      return 0;
    }
    
    const value1 = getInputValue(inputIds[0]);
    const value2 = getInputValue(inputIds[1]);
    
    return calculateAverage(value1, value2);
  };

  return (
    <div className="calculator-group">
      {/* Left column - Inputs */}
      <div className="inputs-column">
        <div className="input-container input-1">
          <label className="input-label" htmlFor={input1Id}>{input1Id}</label>
          <PriceInput
            id={input1Id}
            value={getInputValue(input1Id)}
            onChange={(value) => handleInputChange(input1Id, value)}
            placeholder="0"
          />
        </div>

        <div className="input-container input-2">
          <label className="input-label" htmlFor={input2Id}>{input2Id}</label>
          <PriceInput
            id={input2Id}
            value={getInputValue(input2Id)}
            onChange={(value) => handleInputChange(input2Id, value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Middle column - Arrow */}
      <div className="arrow-column">
        <div className="arrow-container">
          <svg width="60" height="40" viewBox="0 0 60 40" className="arrow-svg">
            <defs>
              <marker
                id="arrowhead-group"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#666"
                />
              </marker>
            </defs>
            
            {/* Two input lines converging to one output line */}
            <line
              x1="5"
              y1="10"
              x2="25"
              y2="20"
              stroke="#666"
              strokeWidth="2"
            />
            <line
              x1="5"
              y1="30"
              x2="25"
              y2="20"
              stroke="#666"
              strokeWidth="2"
            />
            <line
              x1="25"
              y1="20"
              x2="50"
              y2="20"
              stroke="#666"
              strokeWidth="2"
              markerEnd="url(#arrowhead-group)"
            />
          </svg>
        </div>
      </div>

      {/* Right column - Output */}
      <div className="output-column">
        {outputs.map((output) => {
          const outputValue = calculateOutputValue(output.inputs);
          return (
            <div
              key={output.id}
              className="output-container"
            >
              <AverageDisplay
                value={outputValue}
                label={output.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalculatorGroup;