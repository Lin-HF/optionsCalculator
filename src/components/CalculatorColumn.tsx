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
    inputWidth: 110, // Updated to match new input container width
    inputHeight: 80,
    outputWidth: 120, // Adjust based on your AverageDisplay width
    outputHeight: 50, // Adjust based on your AverageDisplay height
    strokeColor: '#666',
    strokeWidth: 2,
    connectionOffset: 40, // Reduced from 10 to make horizontal lines shorter
  };

  /**
   * Generate connection lines for inputs to output
   * Handles special cases for C2 and F2 with custom straight-line connections
   */
  const generateConnectionLines = (inputPositions: any[], output: any) => {
    if (inputPositions.length === 0) return [];

    const lines: JSX.Element[] = [];
    const { inputWidth, inputHeight, strokeColor, strokeWidth, connectionOffset } = CONNECTION_CONFIG;

    // Special cases for C2, F2, D2, and G2 with custom connection patterns
    const isSpecialCase = (outputId: string, inputIds: string[]) => {
      // C2 has inputs A2 and C1 - needs special handling
      if (outputId === 'C2' && inputIds.includes('A2') && inputIds.includes('C1')) {
        return 'C2-special';
      }
      // F2 has inputs E1 and F1 - needs special handling  
      if (outputId === 'F2' && inputIds.includes('E1') && inputIds.includes('F1')) {
        return 'F2-special';
      }
      // D2 has inputs B2 and D1 - needs special handling
      if (outputId === 'D2' && inputIds.includes('B2') && inputIds.includes('D1')) {
        return 'D2-special';
      }
      // G2 has inputs G1 and H1 - needs special handling
      if (outputId === 'G2' && inputIds.includes('G1') && inputIds.includes('H1')) {
        return 'G2-special';
      }
      return null;
    };

    const specialCase = isSpecialCase(output.id, output.inputs);

    if (specialCase === 'C2-special') {
      // Find A2 and C1 input positions
      const a2Input = inputPositions.find(pos => pos.id === 'A2');
      const c1Input = inputPositions.find(pos => pos.id === 'C1');
      
      if (a2Input && c1Input) {
        // Line 1: A2 bottom to C2 top (straight line) - shifted left
        const a2BottomX = a2Input.x + inputWidth / 3 + 15; // Shifted left from center
        const a2BottomY = a2Input.y + inputHeight - 20; // Bottom of A2
        const c2TopX = output.x + CONNECTION_CONFIG.outputWidth / 3 + 12; // Shifted left from center
        const c2TopY = output.y; // Top of C2

        lines.push(
          <line
            key={`${output.id}-A2-line`}
            x1={a2BottomX}
            y1={a2BottomY}
            x2={c2TopX}
            y2={c2TopY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

        // Line 2: C2 right to C1 (straight line) - shifted left
        const c2RightX = output.x + CONNECTION_CONFIG.outputWidth - 10; // Slightly left of right edge
        const c2RightY = output.y + CONNECTION_CONFIG.outputHeight / 2; // Center of C2
        const c1LeftX = c1Input.x + 5; // Slightly right of left edge
        const c1LeftY = c1Input.y + inputHeight / 2; // Center of C1

        lines.push(
          <line
            key={`${output.id}-C1-line`}
            x1={c2RightX}
            y1={c2RightY}
            x2={c1LeftX}
            y2={c1LeftY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
      return lines;
    }

    if (specialCase === 'F2-special') {
      // Find E1 and F1 input positions
      const e1Input = inputPositions.find(pos => pos.id === 'E1');
      const f1Input = inputPositions.find(pos => pos.id === 'F1');
      
      if (e1Input && f1Input) {
        // Line 1: E1 top to F2 bottom (straight line) - shifted left
        const e1TopX = e1Input.x + inputWidth / 3 + 16; // Shifted left from center
        const e1TopY = e1Input.y; // Top of E1
        const f2BottomX = output.x + CONNECTION_CONFIG.outputWidth / 3 + 12; // Shifted left from center
        const f2BottomY = output.y + CONNECTION_CONFIG.outputHeight - 10; // Bottom of F2

        lines.push(
          <line
            key={`${output.id}-E1-line`}
            x1={e1TopX}
            y1={e1TopY}
            x2={f2BottomX}
            y2={f2BottomY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

        // Line 2: F2 right to F1 (straight line) - shifted left
        const f2RightX = output.x + CONNECTION_CONFIG.outputWidth - 15; // Slightly left of right edge
        const f2RightY = output.y + CONNECTION_CONFIG.outputHeight / 2; // Center of F2
        const f1LeftX = f1Input.x + 5; // Slightly right of left edge
        const f1LeftY = f1Input.y + inputHeight / 2; // Center of F1

        lines.push(
          <line
            key={`${output.id}-F1-line`}
            x1={f2RightX}
            y1={f2RightY}
            x2={f1LeftX}
            y2={f1LeftY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
      return lines;
    }

    if (specialCase === 'D2-special') {
      // Find B2 and D1 input positions
      const b2Input = inputPositions.find(pos => pos.id === 'B2');
      const d1Input = inputPositions.find(pos => pos.id === 'D1');
      
      if (b2Input && d1Input) {
        // Line 1: B2 bottom to D2 top (straight line) - shifted left
        const b2BottomX = b2Input.x + inputWidth / 3 + 15; // Shifted left from center
        const b2BottomY = b2Input.y + inputHeight - 20; // Bottom of B2
        const d2TopX = output.x + CONNECTION_CONFIG.outputWidth / 3 + 12; // Shifted left from center
        const d2TopY = output.y; // Top of D2

        lines.push(
          <line
            key={`${output.id}-B2-line`}
            x1={b2BottomX}
            y1={b2BottomY}
            x2={d2TopX}
            y2={d2TopY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

        // Line 2: D2 left to D1 right (straight line) - shifted left
        const d2LeftX = output.x + 5; // Slightly right of left edge
        const d2LeftY = output.y + CONNECTION_CONFIG.outputHeight / 2; // Center of D2
        const d1RightX = d1Input.x + inputWidth - 5; // Slightly left of right edge
        const d1RightY = d1Input.y + inputHeight / 2; // Center of D1

        lines.push(
          <line
            key={`${output.id}-D1-line`}
            x1={d2LeftX}
            y1={d2LeftY}
            x2={d1RightX}
            y2={d1RightY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
      return lines;
    }

    if (specialCase === 'G2-special') {
      // Find G1 and H1 input positions
      const g1Input = inputPositions.find(pos => pos.id === 'G1');
      const h1Input = inputPositions.find(pos => pos.id === 'H1');
      
      if (g1Input && h1Input) {
        // Line 1: G1 right to G2 left (straight line) - shifted left
        const g1RightX = g1Input.x + inputWidth - 5; // Slightly left of right edge
        const g1RightY = g1Input.y + inputHeight / 2; // Center of G1
        const g2LeftX = output.x + 5; // Slightly right of left edge
        const g2LeftY = output.y + CONNECTION_CONFIG.outputHeight / 2; // Center of G2

        lines.push(
          <line
            key={`${output.id}-G1-line`}
            x1={g1RightX}
            y1={g1RightY}
            x2={g2LeftX}
            y2={g2LeftY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

        // Line 2: G2 bottom to H1 top (straight line) - shifted left
        const g2BottomX = output.x + CONNECTION_CONFIG.outputWidth / 3 + 12; // Shifted left from center
        const g2BottomY = output.y + CONNECTION_CONFIG.outputHeight - 10; // Bottom of G2
        const h1TopX = h1Input.x + inputWidth / 3 + 17; // Shifted left from center
        const h1TopY = h1Input.y; // Top of H1

        lines.push(
          <line
            key={`${output.id}-H1-line`}
            x1={g2BottomX}
            y1={g2BottomY}
            x2={h1TopX}
            y2={h1TopY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
      return lines;
    }

    // Default complex routing for other cases (A1,A2 -> A3, etc.)
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
            {input.label && (
              <span 
                className={`external-option-label external-option-label--${input.label.toLowerCase()}`}
                style={{
                  position: 'absolute',
                  left: (input.id === 'C1' || input.id === 'F1') ? '-30px' : '115px', // Left for C1/F1, right for D1/G1
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {input.label}
              </span>
            )}
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
              <label className="input-label" htmlFor={output.id}>
                {output.id}
              </label>
              <AverageDisplay
                value={outputValue}
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