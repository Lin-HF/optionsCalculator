import React from 'react';
import DateHeader from './DateHeader';
import PriceInput from './PriceInput';
import AverageDisplay from './AverageDisplay';
import { calculateAverage } from '../utils/calculationUtils';
import { getLayoutByColumnIndex } from '../config/calculatorConfig';
import './CalculatorColumn.css';

interface CalculatorColumnProps {
  weekOffset: number;
  columnIndex: number;
  inputValues: Record<string, number>;
  onValueChange: (id: string, value: number) => void;
}

const CalculatorColumn: React.FC<CalculatorColumnProps> = ({
  weekOffset,
  columnIndex,
  inputValues,
  onValueChange
}) => {
  const layout = getLayoutByColumnIndex(columnIndex);

  const getInputValue = (id: string): number => {
    return inputValues[id] || 0;
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
    <div className="calculator-column">
      {/* Date header for this column */}
      <DateHeader weekOffset={weekOffset} />
      
      {/* Calculator area with absolute positioning */}
      <div className="calculator-area">
        {/* Render all inputs for this column */}
        {layout.inputs.map((input) => (
          <div
            key={input.id}
            className="input-container"
            style={{
              position: 'absolute',
              left: `${input.x}px`,
              top: `${input.y}px`,
            }}
          >
            <label className="input-label" htmlFor={input.id}>
              {input.id}
            </label>
            <PriceInput
              id={input.id}
              value={getInputValue(input.id)}
              onChange={(value) => onValueChange(input.id, value)}
              placeholder="0"
              color={input.color}
            />
          </div>
        ))}

        {/* Render all outputs for this column */}
        {layout.outputs.map((output) => {
          const outputValue = calculateOutputValue(output.inputs);
          return (
            <div
              key={output.id}
              className="output-container"
              style={{
                position: 'absolute',
                left: `${output.x}px`,
                top: `${output.y}px`,
              }}
            >
              <AverageDisplay
                value={outputValue}
                label={output.id}
              />
            </div>
          );
        })}

        {/* Visual connection lines */}
        <svg className="connection-lines" width="100%" height="100%">
          {layout.outputs.map((output) => {
            const inputPositions = output.inputs.map(inputId => 
              layout.inputs.find(input => input.id === inputId)
            ).filter(Boolean);

            return inputPositions.map((inputPos) => {
              if (!inputPos) return null;
              
              // Draw line from input to output
              const inputCenterX = inputPos.x + 42; // Input width/2 + padding
              const inputCenterY = inputPos.y + 20; // Input height/2
              const outputCenterX = output.x + 42; // Output width/2
              const outputCenterY = output.y + 15; // Output height/2

              return (
                <line
                  key={`${output.id}-${inputPos.id}`}
                  x1={inputCenterX}
                  y1={inputCenterY}
                  x2={outputCenterX}
                  y2={outputCenterY}
                  stroke="#ddd"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              );
            });
          })}
        </svg>
      </div>
    </div>
  );
};

export default CalculatorColumn;