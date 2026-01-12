import React from 'react';
import DateHeader from './DateHeader';
import PriceInput from './PriceInput';
import AverageDisplay from './AverageDisplay';
import { calculateAverage } from '../utils/calculationUtils';
import { getLayoutByColumnIndex, getEnhancedInputById, getEnhancedOutputById } from '../config/calculatorConfig';
import { arrowLines, Llines } from '../utils/lineUtils';
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

  // Function to render arrow lines for calculation A (A1,A2 → A3)
  const renderCalculationALines = () => {
    // Only render for left column (columnIndex 0) which contains calculation A
    if (columnIndex !== 0) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const a1Input = getEnhancedInputById('A1', layout);
    const a2Input = getEnhancedInputById('A2', layout);
    const a3Output = getEnhancedOutputById('A3', layout);

    // Ensure all elements exist
    if (!a1Input || !a2Input || !a3Output) {
      console.warn('Could not find all elements for calculation A (A1,A2 → A3)');
      return null;
    }

    // Generate arrow lines using the arrowLines function
    const arrowLinesResult = arrowLines(
      a1Input.position,
      a2Input.position,
      a3Output.borderMidpoints
    );

    // Render SVG lines
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

  // Function to render arrow lines for calculation B (B1,B2 → B3)
  const renderCalculationBLines = () => {
    // Only render for middle column (columnIndex 1) which contains calculation B
    if (columnIndex !== 1) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const b1Input = getEnhancedInputById('B1', layout);
    const b2Input = getEnhancedInputById('B2', layout);
    const b3Output = getEnhancedOutputById('B3', layout);

    // Ensure all elements exist
    if (!b1Input || !b2Input || !b3Output) {
      console.warn('Could not find all elements for calculation B (B1,B2 → B3)');
      return null;
    }

    // Generate arrow lines using the arrowLines function
    const arrowLinesResult = arrowLines(
      b1Input.position,
      b2Input.position,
      b3Output.borderMidpoints
    );

    // Render SVG lines
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

  // Function to render arrow lines for calculation E (E1,E2 → E3)
  const renderCalculationELines = () => {
    // Only render for left column (columnIndex 0) which contains calculation E
    if (columnIndex !== 0) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const e1Input = getEnhancedInputById('E1', layout);
    const e2Input = getEnhancedInputById('E2', layout);
    const e3Output = getEnhancedOutputById('E3', layout);

    // Ensure all elements exist
    if (!e1Input || !e2Input || !e3Output) {
      console.warn('Could not find all elements for calculation E (E1,E2 → E3)');
      return null;
    }

    // Generate arrow lines using the arrowLines function
    const arrowLinesResult = arrowLines(
      e1Input.position,
      e2Input.position,
      e3Output.borderMidpoints
    );

    // Render SVG lines
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

  // Function to render arrow lines for calculation H (H1,H2 → H3)
  const renderCalculationHLines = () => {
    // Only render for middle column (columnIndex 1) which contains calculation H
    if (columnIndex !== 1) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const h1Input = getEnhancedInputById('H1', layout);
    const h2Input = getEnhancedInputById('H2', layout);
    const h3Output = getEnhancedOutputById('H3', layout);

    // Ensure all elements exist
    if (!h1Input || !h2Input || !h3Output) {
      console.warn('Could not find all elements for calculation H (H1,H2 → H3)');
      return null;
    }

    // Generate arrow lines using the arrowLines function
    const arrowLinesResult = arrowLines(
      h1Input.position,
      h2Input.position,
      h3Output.borderMidpoints
    );

    // Render SVG lines
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

  // Function to render arrow lines for calculation I (I1,I2 → I3)
  const renderCalculationILines = () => {
    // Only render for right column (columnIndex 2) which contains calculation I
    if (columnIndex !== 2) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const i1Input = getEnhancedInputById('I1', layout);
    const i2Input = getEnhancedInputById('I2', layout);
    const i3Output = getEnhancedOutputById('I3', layout);

    // Ensure all elements exist
    if (!i1Input || !i2Input || !i3Output) {
      console.warn('Could not find all elements for calculation I (I1,I2 → I3)');
      return null;
    }

    // Generate arrow lines using the arrowLines function
    const arrowLinesResult = arrowLines(
      i1Input.position,
      i2Input.position,
      i3Output.borderMidpoints
    );

    // Render SVG lines
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

  // Function to render L-lines for connection A2,C1 → C2
  const renderA2C1ToC2Lines = () => {
    // Only render for left column (columnIndex 0) which contains this connection
    if (columnIndex !== 0) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const a2Input = getEnhancedInputById('A2', layout);
    const c1Input = getEnhancedInputById('C1', layout);
    const c2Output = getEnhancedOutputById('C2', layout);

    // Ensure all elements exist
    if (!a2Input || !c1Input || !c2Output) {
      console.warn('Could not find all elements for connection A2,C1 → C2');
      return null;
    }

    // Determine appropriate rotation based on element positions
    // A2 is at (25, 85), C1 is at (220, 175), C2 is at (-60, 190)
    // A2 is above and to the left of C1, C2 is below A2 and to the left of C1
    // This suggests a bottomRightCorner rotation would work best
    const rotation = 'bottomRightCorner';

    // Generate L-lines using the Llines function with correct positions
    const llinesResult = Llines(
      a2Input.position,
      c1Input.position,
      rotation
    );

    // Render SVG lines
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

  // Function to render L-lines for connection D1,B2 → D2
  const renderD1B2ToD2Lines = () => {
    // Only render for middle column (columnIndex 1) which contains this connection
    if (columnIndex !== 1) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const d1Input = getEnhancedInputById('D1', layout);
    const b2Input = getEnhancedInputById('B2', layout);
    const d2Output = getEnhancedOutputById('D2', layout);

    // Ensure all elements exist
    if (!d1Input || !b2Input || !d2Output) {
      console.warn('Could not find all elements for connection D1,B2 → D2');
      return null;
    }

    // For D1,B2 → D2 connection:
    // D1 is at (0, 175) - connect from rightMid (input1Position.rightMid)
    // B2 is at (165, 85) - connect from bottomMid (input2Position.bottomMid)
    // For bottomRightCorner: input1 uses rightMid, input2 uses bottomMid
    // So we need to swap the inputs: B2 as input1, D1 as input2
    const rotation = 'bottomRightCorner';

    // Generate L-lines using the Llines function with swapped positions
    // B2 (bottomMid) as input1, D1 (rightMid) as input2 for bottomRightCorner
    const llinesResult = Llines(
      b2Input.position,
      d1Input.position,
      rotation
    );

    // Render SVG lines
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

  // Function to render L-lines for connection E1,F1 → F2
  const renderE1F1ToF2Lines = () => {
    // Only render for left column (columnIndex 0) which contains this connection
    if (columnIndex !== 0) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const e1Input = getEnhancedInputById('E1', layout);
    const f1Input = getEnhancedInputById('F1', layout);
    const f2Output = getEnhancedOutputById('F2', layout);

    // Ensure all elements exist
    if (!e1Input || !f1Input || !f2Output) {
      console.warn('Could not find all elements for connection E1,F1 → F2');
      return null;
    }

    // Determine appropriate rotation based on element positions
    // E1 is at (25, 365), F1 is at (220, 255), F2 is at (-50, 270)
    // E1 is below and to the left of F1, F2 is to the left of both
    // We need to connect E1 (topMid) to F1 (leftMid) with topLeftCorner rotation
    const rotation = 'topLeftCorner';

    // Generate L-lines using the Llines function
    const llinesResult = Llines(
      e1Input.position,
      f1Input.position,
      rotation
    );

    // Render SVG lines
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

  // Function to render L-lines for connection G1,H1 → G2
  const renderG1H1ToG2Lines = () => {
    // Only render for middle column (columnIndex 1) which contains this connection
    if (columnIndex !== 1) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const g1Input = getEnhancedInputById('G1', layout);
    const h1Input = getEnhancedInputById('H1', layout);
    const g2Output = getEnhancedOutputById('G2', layout);

    // Ensure all elements exist
    if (!g1Input || !h1Input || !g2Output) {
      console.warn('Could not find all elements for connection G1,H1 → G2');
      return null;
    }

    // For G1,H1 → G2 connection:
    // G1 is at (0, 255) - connect from rightMid
    // H1 is at (165, 365) - connect from topMid
    // G2 is at (250, 250) - output position
    // To get G1.rightMid → H1.topMid, we need to swap inputs and use topRightCorner
    // This gives us H1.topMid → G1.rightMid which is the desired connection
    const rotation = 'topRightCorner';

    // Generate L-lines using the Llines function with swapped inputs
    const llinesResult = Llines(
      h1Input.position,
      g1Input.position,
      rotation
    );

    // Render SVG lines
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

  // Function to render arrow lines for calculation J (J1,J2 → J3)
  const renderCalculationJLines = () => {
    // Only render for right column (columnIndex 2) which contains calculation J
    if (columnIndex !== 2) {
      return null;
    }

    // Get enhanced input and output elements with position properties
    const j1Input = getEnhancedInputById('J1', layout);
    const j2Input = getEnhancedInputById('J2', layout);
    const j3Output = getEnhancedOutputById('J3', layout);

    // Ensure all elements exist
    if (!j1Input || !j2Input || !j3Output) {
      console.warn('Could not find all elements for calculation J (J1,J2 → J3)');
      return null;
    }

    // Generate arrow lines using the arrowLines function
    const arrowLinesResult = arrowLines(
      j1Input.position,
      j2Input.position,
      j3Output.borderMidpoints
    );

    // Render SVG lines
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

  return (
    <div className={`calculator-column ${columnIndex === 1 ? 'calculator-column--middle' : ''}`}>
      {/* Date header for this column */}
      <DateHeader weekOffset={weekOffset} />
      
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

        {/* Render all inputs for this column */}
        {layout.inputs.map((input) => (
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
            {/* Input labels hidden for cleaner appearance
            <label className="input-label" htmlFor={input.id}>
              {input.id}
            </label>
            */}
            <PriceInput
              id={input.id}
              value={getInputValue(input.id)}
              onChange={(value) => onValueChange(input.id, value)}
              placeholder="0"
              color={input.color}
            />
            {/* Labels temporarily hidden for cleaner line visualization
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
            */}
          </div>
        ))}

        {/* Render all outputs for this column */}
        {layout.outputs.map((output) => {
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

export default CalculatorColumn;