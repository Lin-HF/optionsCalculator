// Calculator layout configuration - REDESIGNED for shared inputs
// This file defines the complete calculator layout with shared input positioning

import { CalculationConfig } from '../types';

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

// Input positioning configuration - each input appears only once
export interface InputPosition {
  id: string;
  x: number; // Horizontal position (pixels from left)
  y: number; // Vertical position (pixels from top)
  color: 'red' | 'green'; // Color coding for the input
  label?: string; // Optional label like "PUT" or "CALL"
}

export interface OutputPosition {
  id: string;
  x: number; // Horizontal position (pixels from left)
  y: number; // Vertical position (pixels from top)
  inputs: string[]; // Input IDs this output depends on
  position: 'left' | 'right' | 'top' | 'bottom'; // Position relative to inputs
  // 'left': Output positioned to the left of inputs
  // 'right': Output positioned to the right of inputs  
  // 'top': Output positioned above inputs
  // 'bottom': Output positioned below inputs
}

// Column layout configuration with absolute positioning
export interface ColumnLayout {
  weekOffset: number;
  inputs: InputPosition[];
  outputs: OutputPosition[];
}

// Left column layout (本周五 - This Friday)
export const LEFT_COLUMN_LAYOUT: ColumnLayout = {
  weekOffset: 0,
  inputs: [
    { id: 'A1', x: 25, y: 25, color: 'green' },
    { id: 'A2', x: 25, y: 85, color: 'green' }, // Shared between A3 and C2 calculations
    { id: 'C1', x: 220, y: 175, color: 'red', label: 'PUT' }, // Moved to right as requested
    { id: 'F1', x: 220, y: 255, color: 'green', label: 'CALL' }, // Moved above E group
    { id: 'E1', x: 25, y: 365, color: 'red' }, // Shared between E3 and F2 calculations - moved down
    { id: 'E2', x: 25, y: 425, color: 'red' }, // Moved down
  ],
  outputs: [
    { id: 'A3', x: 200, y: 70, inputs: ['A1', 'A2'], position: 'right' }, // Adjusted to better center between A1 and A2
    { id: 'C2', x: 25, y: 190, inputs: ['A2', 'C1'], position: 'left' }, // Moved down to avoid overlap with A2
    { id: 'F2', x: 25, y: 270, inputs: ['E1', 'F1'], position: 'left' }, // Moved above E group
    { id: 'E3', x: 200, y: 410, inputs: ['E1', 'E2'], position: 'right' }, // Moved down
  ]
};

// Middle column layout (下周五 - Next Friday)
export const MIDDLE_COLUMN_LAYOUT: ColumnLayout = {
  weekOffset: 1,
  inputs: [
    { id: 'B1', x: 165, y: 25, color: 'green' },
    { id: 'B2', x: 165, y: 85, color: 'green' }, // Shared between B3 and D2 calculations
    { id: 'D1', x: 0, y: 175, color: 'red', label: 'PUT' }, // Moved to left as requested
    { id: 'G1', x: 0, y: 255, color: 'green', label: 'CALL' }, // Moved to left as requested
    { id: 'H1', x: 165, y: 365, color: 'red' }, // Shared between H3 and G2 calculations
    { id: 'H2', x: 165, y: 425, color: 'red' },
  ],
  outputs: [
    { id: 'B3', x: 340, y: 70, inputs: ['B1', 'B2'], position: 'right' },
    { id: 'D2', x: 165, y: 190, inputs: ['B2', 'D1'], position: 'right' }, // Moved to right as requested
    { id: 'G2', x: 165, y: 270, inputs: ['G1', 'H1'], position: 'right' }, // Moved to right as requested
    { id: 'H3', x: 340, y: 410, inputs: ['H1', 'H2'], position: 'right' },
  ]
};

// Right column layout (下下周五 - Week After Next Friday)
export const RIGHT_COLUMN_LAYOUT: ColumnLayout = {
  weekOffset: 2,
  inputs: [
    { id: 'I1', x: 25, y: 25, color: 'green' },
    { id: 'I2', x: 25, y: 85, color: 'green' },
    { id: 'J1', x: 25, y: 165, color: 'red' },
    { id: 'J2', x: 25, y: 225, color: 'red' },
  ],
  outputs: [
    { id: 'I3', x: 200, y: 70, inputs: ['I1', 'I2'], position: 'right' },
    { id: 'J3', x: 200, y: 210, inputs: ['J1', 'J2'], position: 'right' },
  ]
};

// Complete column configuration array for easy iteration
export const COLUMN_LAYOUTS = [
  LEFT_COLUMN_LAYOUT,
  MIDDLE_COLUMN_LAYOUT,
  RIGHT_COLUMN_LAYOUT
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

// Helper function to get layout by column index
export const getLayoutByColumnIndex = (columnIndex: number): ColumnLayout => {
  if (columnIndex < 0 || columnIndex >= COLUMN_LAYOUTS.length) {
    console.warn(`Invalid column index: ${columnIndex}. Returning empty layout.`);
    return {
      weekOffset: 0,
      inputs: [],
      outputs: []
    };
  }
  return COLUMN_LAYOUTS[columnIndex];
};

// Helper function to validate configuration consistency
export const validateConfiguration = (): boolean => {
  const allInputIds = getAllInputIds();
  const configuredInputIds = new Set<string>();
  
  // Collect all input IDs from column layouts
  COLUMN_LAYOUTS.forEach(layout => {
    layout.inputs.forEach(input => {
      configuredInputIds.add(input.id);
    });
  });
  
  // Check if all calculation inputs are covered by column layouts
  const missingInputs = allInputIds.filter(id => !configuredInputIds.has(id));
  
  if (missingInputs.length > 0) {
    console.warn('Missing input configurations:', missingInputs);
    return false;
  }
  
  return true;
};

// Legacy compatibility - convert new layout to old group format for gradual migration
export interface CalculatorGroupConfig {
  input1Id: string;
  input2Id: string;
  outputs: Array<{
    id: string;
    position: 'left' | 'right' | 'top' | 'bottom';
    inputs: string[];
  }>;
}

// These are kept for backward compatibility but should be phased out
export const LEFT_COLUMN_GROUPS: CalculatorGroupConfig[] = [];
export const MIDDLE_COLUMN_GROUPS: CalculatorGroupConfig[] = [];
export const RIGHT_COLUMN_GROUPS: CalculatorGroupConfig[] = [];

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