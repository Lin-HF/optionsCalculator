// Core type definitions for the price calculator

// Input values state type
export type InputValues = {
  // Left column (本周五)
  A1: number;
  A2: number;
  C1: number;
  E1: number;
  E2: number;
  F1: number;
  
  // Middle column (下周五)
  B1: number;
  B2: number;
  D1: number;
  G1: number;
  H1: number;
  H2: number;
  
  // Right column (下下周五)
  I1: number;
  I2: number;
  J1: number;
  J2: number;
};

// Output configuration for calculations
export interface OutputConfig {
  id: string;
  position: 'left' | 'right';
  inputs: string[]; // Input IDs that participate in calculation
}

// Calculation configuration type
export type CalculationConfig = {
  [key: string]: {
    inputs: string[];
    position: 'left' | 'right';
  };
};

// Note: CALCULATIONS configuration moved to src/config/calculatorConfig.ts

// Component prop interfaces
export interface AppProps {}

export interface AppState {
  // 所有输入值的状态
  inputValues: Record<string, number>;
}

export interface DateHeaderProps {
  weekOffset: number; // 0=本周, 1=下周, 2=下下周
}

export interface CalculatorColumnProps {
  weekOffset: number;
  columnIndex: number;
  inputValues: Record<string, number>;
  onValueChange: (id: string, value: number) => void;
}

export interface CalculatorGroupConfig {
  input1Id: string;
  input2Id: string;
  outputs: OutputConfig[];
}

export interface CalculatorGroupProps {
  input1Id: string;
  input2Id: string;
  outputs: OutputConfig[];
  onValueChange: (id: string, value: number) => void;
}

export interface PriceInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  color?: 'red' | 'green';
}

export interface AverageDisplayProps {
  value: number;
  label: string;
}