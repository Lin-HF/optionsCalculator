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

// Default calculation configuration
export const CALCULATIONS: CalculationConfig = {
  A3: { inputs: ['A1', 'A2'], position: 'right' },
  C2: { inputs: ['A2', 'C1'], position: 'left' },
  E3: { inputs: ['E1', 'E2'], position: 'right' },
  F2: { inputs: ['E1', 'F1'], position: 'left' },
  B3: { inputs: ['B1', 'B2'], position: 'right' },
  D2: { inputs: ['B2', 'D1'], position: 'left' },
  H3: { inputs: ['H1', 'H2'], position: 'right' },
  G2: { inputs: ['G1', 'H1'], position: 'left' },
  I3: { inputs: ['I1', 'I2'], position: 'right' },
  J3: { inputs: ['J1', 'J2'], position: 'right' },
};

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
  calculatorGroups: CalculatorGroupConfig[];
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
}

export interface AverageDisplayProps {
  value: number;
  label: string;
}