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

  // Configuration for connection lines - easy to adjust
  const CONNECTION_CONFIG = {
    inputWidth: 84,
    inputHeight: 80,
    outputWidth: 120, // Adjust based on your AverageDisplay width
    outputHeight: 50, // Adjust based on your AverageDisplay height
    strokeColor: '#666',
    strokeWidth: 2,
    connectionOffset: 40, // Reduced from 10 to make horizontal lines shorter
  };

  /**
   * Generate connection lines for inputs to output (like A1, A2 -> A3)
   * Creates a clean connection pattern with horizontal and vertical segments
   */
  const generateConnectionLines = (inputPositions: any[], output: any) => {
    if (inputPositions.length === 0) return [];

    const lines: JSX.Element[] = [];
    const { inputWidth, inputHeight, strokeColor, strokeWidth, connectionOffset } = CONNECTION_CONFIG;

    // Calculate connection points
    const outputLeftX = output.x;
    const outputCenterY = output.y + CONNECTION_CONFIG.outputHeight / 2;
    const connectionX = outputLeftX - connectionOffset; // Vertical line position

    inputPositions.forEach((inputPos, index) => {
      if (!inputPos) return;

      const inputRightX = inputPos.x + inputWidth;
      const inputCenterY = inputPos.y + inputHeight / 2;
      const lineKey = `${output.id}-${inputPos.id}`;

      // Line 1: From input right edge to connection point
      lines.push(
        <line
          key={`${lineKey}-horizontal`}
          x1={inputRightX}
          y1={inputCenterY}
          x2={connectionX}
          y2={inputCenterY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      );

      // Line 2: Vertical segment (only draw once, connecting all inputs)
      if (index === 0 && inputPositions.length > 1) {
        const firstInputY = inputPositions[0].y + inputHeight / 2;
        const lastInputY = inputPositions[inputPositions.length - 1].y + inputHeight / 2;
        
        lines.push(
          <line
            key={`${output.id}-vertical`}
            x1={connectionX}
            y1={Math.min(firstInputY, lastInputY)}
            x2={connectionX}
            y2={Math.max(firstInputY, lastInputY)}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
    });

    // Line 3: From connection point to output
    const midInputY = inputPositions.length > 1 
      ? (inputPositions[0].y + inputPositions[inputPositions.length - 1].y + inputHeight) / 2
      : inputPositions[0].y + inputHeight / 2;

    lines.push(
      <line
        key={`${output.id}-to-output`}
        x1={connectionX}
        y1={midInputY}
        x2={outputLeftX}
        y2={outputCenterY}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );

    return lines;
  };

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

            return generateConnectionLines(inputPositions, output);
          })}
        </svg>
      </div>
    </div>
  );
};

export default CalculatorColumn;