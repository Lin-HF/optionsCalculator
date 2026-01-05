// Calculator layout configuration
// This file defines the complete calculator layout data for all three columns

import { CalculatorGroupConfig, CalculationConfig } from '../types';

// Central calculation configuration object
// Maps output IDs to their input dependencies and display positions
export const CALCULATIONS: CalculationConfig = {
  // Left column calculations (本周五)
  A3: { inputs: ['A1', 'A2'], position: 'right' },
  C2: { inputs: ['A2', 'C1'], position: 'left' },
  E3: { inputs: ['E1', 'E2'], position: 'right' },
  F2: { inputs: ['E1', 'F1'], position: 'left' },
  
  // Middle column calculations (下周五)
  B3: { inputs: ['B1', 'B2'], position: 'right' },
  D2: { inputs: ['B2', 'D1'], position: 'left' },
  H3: { inputs: ['H1', 'H2'], position: 'right' },
  G2: { inputs: ['G1', 'H1'], position: 'left' },
  
  // Right column calculations (下下周五)
  I3: { inputs: ['I1', 'I2'], position: 'right' },
  J3: { inputs: ['J1', 'J2'], position: 'right' },
};

// Calculator group configurations for each column
// These define the structure and relationships between inputs and outputs

// Left column configuration (本周五 - This Friday)
export const LEFT_COLUMN_GROUPS: CalculatorGroupConfig[] = [
  {
    input1Id: 'A1',
    input2Id: 'A2',
    outputs: [
      { id: 'A3', position: 'right', inputs: ['A1', 'A2'] }
    ]
  },
  {
    input1Id: 'A2',
    input2Id: 'C1',
    outputs: [
      { id: 'C2', position: 'left', inputs: ['A2', 'C1'] }
    ]
  },
  {
    input1Id: 'E1',
    input2Id: 'E2',
    outputs: [
      { id: 'E3', position: 'right', inputs: ['E1', 'E2'] }
    ]
  },
  {
    input1Id: 'E1',
    input2Id: 'F1',
    outputs: [
      { id: 'F2', position: 'left', inputs: ['E1', 'F1'] }
    ]
  }
];

// Middle column configuration (下周五 - Next Friday)
export const MIDDLE_COLUMN_GROUPS: CalculatorGroupConfig[] = [
  {
    input1Id: 'B1',
    input2Id: 'B2',
    outputs: [
      { id: 'B3', position: 'right', inputs: ['B1', 'B2'] }
    ]
  },
  {
    input1Id: 'B2',
    input2Id: 'D1',
    outputs: [
      { id: 'D2', position: 'left', inputs: ['B2', 'D1'] }
    ]
  },
  {
    input1Id: 'H1',
    input2Id: 'H2',
    outputs: [
      { id: 'H3', position: 'right', inputs: ['H1', 'H2'] }
    ]
  },
  {
    input1Id: 'G1',
    input2Id: 'H1',
    outputs: [
      { id: 'G2', position: 'left', inputs: ['G1', 'H1'] }
    ]
  }
];

// Right column configuration (下下周五 - Week After Next Friday)
export const RIGHT_COLUMN_GROUPS: CalculatorGroupConfig[] = [
  {
    input1Id: 'I1',
    input2Id: 'I2',
    outputs: [
      { id: 'I3', position: 'right', inputs: ['I1', 'I2'] }
    ]
  },
  {
    input1Id: 'J1',
    input2Id: 'J2',
    outputs: [
      { id: 'J3', position: 'right', inputs: ['J1', 'J2'] }
    ]
  }
];

// Complete column configuration array for easy iteration
export const COLUMN_CONFIGURATIONS = [
  {
    weekOffset: 0,
    groups: LEFT_COLUMN_GROUPS,
    title: '本周五'
  },
  {
    weekOffset: 1,
    groups: MIDDLE_COLUMN_GROUPS,
    title: '下周五'
  },
  {
    weekOffset: 2,
    groups: RIGHT_COLUMN_GROUPS,
    title: '下下周五'
  }
];

// Helper function to get all input IDs used in the calculator
export const getAllInputIds = (): string[] => {
  const inputIds = new Set<string>();
  
  Object.values(CALCULATIONS).forEach(calc => {
    calc.inputs.forEach(inputId => inputIds.add(inputId));
  });
  
  return Array.from(inputIds).sort();
};

// Helper function to get calculation config by output ID
export const getCalculationByOutputId = (outputId: string) => {
  return CALCULATIONS[outputId];
};

// Helper function to validate configuration consistency
export const validateConfiguration = (): boolean => {
  const allInputIds = getAllInputIds();
  const configuredInputIds = new Set<string>();
  
  // Collect all input IDs from column configurations
  [LEFT_COLUMN_GROUPS, MIDDLE_COLUMN_GROUPS, RIGHT_COLUMN_GROUPS].forEach(groups => {
    groups.forEach(group => {
      configuredInputIds.add(group.input1Id);
      configuredInputIds.add(group.input2Id);
    });
  });
  
  // Check if all calculation inputs are covered by column configurations
  const missingInputs = allInputIds.filter(id => !configuredInputIds.has(id));
  
  if (missingInputs.length > 0) {
    console.warn('Missing input configurations:', missingInputs);
    return false;
  }
  
  return true;
};