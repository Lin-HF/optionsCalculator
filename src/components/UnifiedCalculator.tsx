import React from 'react';
import PriceInput from './PriceInput';
import AverageDisplay from './AverageDisplay';
import DateHeader from './DateHeader';
import { calculateAverage } from '../utils/calculationUtils';
import { 
  LEFT_COLUMN_LAYOUT, 
  MIDDLE_COLUMN_LAYOUT, 
  RIGHT_COLUMN_LAYOUT,
  ColumnLayout
} from '../config/calculatorConfig';
import { arrowLines, Llines } from '../utils/lineUtils';
import './UnifiedCalculator.css';

interface UnifiedCalculatorProps {
  inputValues: Record<string, number>;
  onValueChange: (id: string, value: number) => void;
}

const UnifiedCalculator: React.FC<UnifiedCalculatorProps> = ({
  inputValues,
  onValueChange
}) => {
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

  // Unified position system - adjust coordinates to place all elements on one graph
  // Left column: +50px for spacing from date headers
  // Middle column: +450px (400px original + 50px spacing)
  // Right column: +950px (800px original + 50px spacing + 100px extra for I,J)
  const getUnifiedPosition = (layout: ColumnLayout, columnOffset: number) => {
    return {
      inputs: layout.inputs.map(input => ({
        ...input,
        x: input.x + columnOffset
      })),
      outputs: layout.outputs.map(output => ({
        ...output,
        x: output.x + columnOffset
      }))
    };
  };

  const leftUnified = getUnifiedPosition(LEFT_COLUMN_LAYOUT, 50);
  const middleUnified = getUnifiedPosition(MIDDLE_COLUMN_LAYOUT, 450);
  const rightUnified = getUnifiedPosition(RIGHT_COLUMN_LAYOUT, 950);

  // Combine all inputs and outputs
  const allInputs = [...leftUnified.inputs, ...middleUnified.inputs, ...rightUnified.inputs];
  const allOutputs = [...leftUnified.outputs, ...middleUnified.outputs, ...rightUnified.outputs];

  // Helper function to get enhanced input by ID from unified layout
  const getUnifiedEnhancedInputById = (inputId: string) => {
    const input = allInputs.find(inp => inp.id === inputId);
    if (!input) {
      console.warn(`Input ${inputId} not found in unified layout`);
      return null;
    }
    
    return {
      ...input,
      position: {
        topMid: { x: input.x + input.width / 2, y: input.y },
        bottomMid: { x: input.x + input.width / 2, y: input.y + input.height },
        leftMid: { x: input.x, y: input.y + input.height / 2 },
        rightMid: { x: input.x + input.width, y: input.y + input.height / 2 }
      }
    };
  };

  // Helper function to get enhanced output by ID from unified layout
  const getUnifiedEnhancedOutputById = (outputId: string) => {
    const output = allOutputs.find(out => out.id === outputId);
    if (!output) {
      console.warn(`Output ${outputId} not found in unified layout`);
      return null;
    }
    
    return {
      ...output,
      borderMidpoints: {
        topMid: { x: output.x + output.width / 2, y: output.y },
        bottomMid: { x: output.x + output.width / 2, y: output.y + output.height },
        leftMid: { x: output.x, y: output.y + output.height / 2 },
        rightMid: { x: output.x + output.width, y: output.y + output.height / 2 }
      }
    };
  };

  // Arrow line rendering functions (same logic as before)
  const renderCalculationALines = () => {
    const a1Input = getUnifiedEnhancedInputById('A1');
    const a2Input = getUnifiedEnhancedInputById('A2');
    const a3Output = getUnifiedEnhancedOutputById('A3');

    if (!a1Input || !a2Input || !a3Output) {
      console.warn('Could not find all elements for calculation A (A1,A2 → A3)');
      return null;
    }

    const arrowLinesResult = arrowLines(
      a1Input.position,
      a2Input.position,
      a3Output.borderMidpoints
    );

    return (
      <g key="calculation-A-lines">
        {arrowLinesResult.lines.map((line, index) => (
          <line
            key={`calc-A-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`calc-A-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderCalculationBLines = () => {
    const b1Input = getUnifiedEnhancedInputById('B1');
    const b2Input = getUnifiedEnhancedInputById('B2');
    const b3Output = getUnifiedEnhancedOutputById('B3');

    if (!b1Input || !b2Input || !b3Output) {
      console.warn('Could not find all elements for calculation B (B1,B2 → B3)');
      return null;
    }

    const arrowLinesResult = arrowLines(
      b1Input.position,
      b2Input.position,
      b3Output.borderMidpoints
    );

    return (
      <g key="calculation-B-lines">
        {arrowLinesResult.lines.map((line, index) => (
          <line
            key={`calc-B-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`calc-B-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderCalculationELines = () => {
    const e1Input = getUnifiedEnhancedInputById('E1');
    const e2Input = getUnifiedEnhancedInputById('E2');
    const e3Output = getUnifiedEnhancedOutputById('E3');

    if (!e1Input || !e2Input || !e3Output) {
      console.warn('Could not find all elements for calculation E (E1,E2 → E3)');
      return null;
    }

    const arrowLinesResult = arrowLines(
      e1Input.position,
      e2Input.position,
      e3Output.borderMidpoints
    );

    return (
      <g key="calculation-E-lines">
        {arrowLinesResult.lines.map((line, index) => (
          <line
            key={`calc-E-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`calc-E-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderCalculationHLines = () => {
    const h1Input = getUnifiedEnhancedInputById('H1');
    const h2Input = getUnifiedEnhancedInputById('H2');
    const h3Output = getUnifiedEnhancedOutputById('H3');

    if (!h1Input || !h2Input || !h3Output) {
      console.warn('Could not find all elements for calculation H (H1,H2 → H3)');
      return null;
    }

    const arrowLinesResult = arrowLines(
      h1Input.position,
      h2Input.position,
      h3Output.borderMidpoints
    );

    return (
      <g key="calculation-H-lines">
        {arrowLinesResult.lines.map((line, index) => (
          <line
            key={`calc-H-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`calc-H-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderCalculationILines = () => {
    const i1Input = getUnifiedEnhancedInputById('I1');
    const i2Input = getUnifiedEnhancedInputById('I2');
    const i3Output = getUnifiedEnhancedOutputById('I3');

    if (!i1Input || !i2Input || !i3Output) {
      console.warn('Could not find all elements for calculation I (I1,I2 → I3)');
      return null;
    }

    const arrowLinesResult = arrowLines(
      i1Input.position,
      i2Input.position,
      i3Output.borderMidpoints
    );

    return (
      <g key="calculation-I-lines">
        {arrowLinesResult.lines.map((line, index) => (
          <line
            key={`calc-I-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`calc-I-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderCalculationJLines = () => {
    const j1Input = getUnifiedEnhancedInputById('J1');
    const j2Input = getUnifiedEnhancedInputById('J2');
    const j3Output = getUnifiedEnhancedOutputById('J3');

    if (!j1Input || !j2Input || !j3Output) {
      console.warn('Could not find all elements for calculation J (J1,J2 → J3)');
      return null;
    }

    const arrowLinesResult = arrowLines(
      j1Input.position,
      j2Input.position,
      j3Output.borderMidpoints
    );

    return (
      <g key="calculation-J-lines">
        {arrowLinesResult.lines.map((line, index) => (
          <line
            key={`calc-J-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`calc-J-line-${index}`}
          />
        ))}
      </g>
    );
  };

  // L-line rendering functions (same logic as before)
  const renderA2C1ToC2Lines = () => {
    const a2Input = getUnifiedEnhancedInputById('A2');
    const c1Input = getUnifiedEnhancedInputById('C1');

    if (!a2Input || !c1Input) {
      console.warn('Could not find all elements for connection A2,C1 → C2');
      return null;
    }

    const rotation = 'bottomRightCorner';
    const llinesResult = Llines(
      a2Input.position,
      c1Input.position,
      rotation
    );

    return (
      <g key="A2C1-to-C2-lines">
        {llinesResult.lines.map((line, index) => (
          <line
            key={`A2C1-C2-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`A2C1-C2-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderD1B2ToD2Lines = () => {
    const d1Input = getUnifiedEnhancedInputById('D1');
    const b2Input = getUnifiedEnhancedInputById('B2');

    if (!d1Input || !b2Input) {
      console.warn('Could not find all elements for connection D1,B2 → D2');
      return null;
    }

    const rotation = 'bottomRightCorner';
    const llinesResult = Llines(
      b2Input.position,
      d1Input.position,
      rotation
    );

    return (
      <g key="D1B2-to-D2-lines">
        {llinesResult.lines.map((line, index) => (
          <line
            key={`D1B2-D2-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`D1B2-D2-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderE1F1ToF2Lines = () => {
    const e1Input = getUnifiedEnhancedInputById('E1');
    const f1Input = getUnifiedEnhancedInputById('F1');

    if (!e1Input || !f1Input) {
      console.warn('Could not find all elements for connection E1,F1 → F2');
      return null;
    }

    const rotation = 'topLeftCorner';
    const llinesResult = Llines(
      e1Input.position,
      f1Input.position,
      rotation
    );

    return (
      <g key="E1F1-to-F2-lines">
        {llinesResult.lines.map((line, index) => (
          <line
            key={`E1F1-F2-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`E1F1-F2-line-${index}`}
          />
        ))}
      </g>
    );
  };

  const renderG1H1ToG2Lines = () => {
    const g1Input = getUnifiedEnhancedInputById('G1');
    const h1Input = getUnifiedEnhancedInputById('H1');

    if (!g1Input || !h1Input) {
      console.warn('Could not find all elements for connection G1,H1 → G2');
      return null;
    }

    const rotation = 'topRightCorner';
    const llinesResult = Llines(
      h1Input.position,
      g1Input.position,
      rotation
    );

    return (
      <g key="G1H1-to-G2-lines">
        {llinesResult.lines.map((line, index) => (
          <line
            key={`G1H1-G2-line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#666"
            strokeWidth="2"
            data-testid={`G1H1-G2-line-${index}`}
          />
        ))}
      </g>
    );
  };

  return (
    <div className="unified-calculator">
      {/* Date headers for each section */}
      <div className="date-headers">
        <div className="date-header-container" style={{ left: '75px' }}>
          <DateHeader weekOffset={0} />
        </div>
        <div className="date-header-container" style={{ left: '600px' }}>
          <DateHeader weekOffset={1} />
        </div>
        <div className="date-header-container" style={{ left: '975px' }}>
          <DateHeader weekOffset={2} />
        </div>
      </div>

      {/* Calculator area with absolute positioning */}
      <div className="calculator-area">
        {/* SVG container for connection lines */}
        <svg
          className="connection-lines"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {renderCalculationALines()}
          {renderCalculationBLines()}
          {renderCalculationELines()}
          {renderCalculationHLines()}
          {renderCalculationILines()}
          {renderCalculationJLines()}
          {renderA2C1ToC2Lines()}
          {renderD1B2ToD2Lines()}
          {renderE1F1ToF2Lines()}
          {renderG1H1ToG2Lines()}
        </svg>

        {/* Render all inputs */}
        {allInputs.map((input) => (
          <div
            key={input.id}
            className="input-container"
            style={{
              position: 'absolute',
              left: `${input.x}px`,
              top: `${input.y}px`,
              zIndex: 2
            }}
          >
            {/* Show PUT/CALL labels above the input boxes for C1, D1, F1, G1 */}
            {input.label && (
              <div 
                className={`option-label option-label--${input.label.toLowerCase()}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '-25px',
                  transform: 'translateX(-50%)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: input.color === 'red' ? '#dc2626' : '#16a34a',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {input.label}
              </div>
            )}
            <PriceInput
              id={input.id}
              value={getInputValue(input.id)}
              onChange={(value) => onValueChange(input.id, value)}
              placeholder="0"
              color={input.color}
            />
          </div>
        ))}

        {/* Render all outputs */}
        {allOutputs.map((output) => {
          const outputValue = calculateOutputValue(output.inputs);
          return (
            <div
              key={output.id}
              className="output-container"
              data-testid={`output-${output.id}`}
              style={{
                position: 'absolute',
                left: `${output.x}px`,
                top: `${output.y}px`,
                zIndex: 2
              }}
            >
              <AverageDisplay
                value={outputValue}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnifiedCalculator;