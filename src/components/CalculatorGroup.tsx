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
      {/* Input 1 */}
      <div className="input-container input-1">
        <label className="input-label" htmlFor={input1Id}>{input1Id}</label>
        <PriceInput
          id={input1Id}
          value={getInputValue(input1Id)}
          onChange={(value) => handleInputChange(input1Id, value)}
          placeholder="0"
        />
      </div>

      {/* Input 2 */}
      <div className="input-container input-2">
        <label className="input-label" htmlFor={input2Id}>{input2Id}</label>
        <PriceInput
          id={input2Id}
          value={getInputValue(input2Id)}
          onChange={(value) => handleInputChange(input2Id, value)}
          placeholder="0"
        />
      </div>

      {/* Outputs */}
      {outputs.map((output) => {
        const outputValue = calculateOutputValue(output.inputs);
        return (
          <div
            key={output.id}
            className={`output-container output-${output.position}`}
          >
            <AverageDisplay
              value={outputValue}
              label={output.id}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CalculatorGroup;