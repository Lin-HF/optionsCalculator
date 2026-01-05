import React from 'react';
import { CalculatorColumnProps } from '../types';
import DateHeader from './DateHeader';
import CalculatorGroup from './CalculatorGroup';
import './CalculatorColumn.css';

interface CalculatorColumnPropsWithValues extends CalculatorColumnProps {
  inputValues?: Record<string, number>;
  onValueChange: (id: string, value: number) => void;
}

const CalculatorColumn: React.FC<CalculatorColumnPropsWithValues> = ({
  weekOffset,
  calculatorGroups,
  inputValues = {},
  onValueChange
}) => {
  return (
    <div className="calculator-column">
      {/* Date header for this column */}
      <DateHeader weekOffset={weekOffset} />
      
      {/* Calculator groups for this column */}
      <div className="calculator-groups">
        {calculatorGroups.map((group, index) => (
          <CalculatorGroup
            key={`${group.input1Id}-${group.input2Id}-${index}`}
            input1Id={group.input1Id}
            input2Id={group.input2Id}
            outputs={group.outputs}
            onValueChange={onValueChange}
            inputValues={inputValues}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculatorColumn;