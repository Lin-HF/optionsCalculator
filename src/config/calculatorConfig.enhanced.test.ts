// Tests for enhanced calculator configuration with position properties
// Validates Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6

import { 
  CalculatorInput, 
  CalculatorOutput,
  createEnhancedInputs,
  createEnhancedOutputs,
  getEnhancedInputById,
  getEnhancedOutputById,
  LEFT_COLUMN_LAYOUT 
} from './calculatorConfig';

describe('Enhanced Calculator Configuration', () => {
  describe('CalculatorInput class', () => {
    test('creates input with correct properties', () => {
      const input = new CalculatorInput('A1', 25, 25, 110, 80, 'green');
      
      expect(input.id).toBe('A1');
      expect(input.x).toBe(25);
      expect(input.y).toBe(25);
      expect(input.width).toBe(110);
      expect(input.height).toBe(80);
      expect(input.color).toBe('green');
    });

    test('calculates position property correctly', () => {
      const input = new CalculatorInput('A1', 25, 25, 110, 80, 'green');
      const position = input.position;
      
      expect(position.topMid).toEqual({ x: 80, y: 25 });
      expect(position.bottomMid).toEqual({ x: 80, y: 105 });
      expect(position.leftMid).toEqual({ x: 25, y: 65 });
      expect(position.rightMid).toEqual({ x: 135, y: 65 });
    });

    test('supports optional label', () => {
      const input = new CalculatorInput('C1', 220, 175, 110, 80, 'red', 'PUT');
      
      expect(input.label).toBe('PUT');
    });
  });

  describe('CalculatorOutput class', () => {
    test('creates output with correct properties', () => {
      const output = new CalculatorOutput('A3', 300, 70, 120, 50, ['A1', 'A2'], 'right');
      
      expect(output.id).toBe('A3');
      expect(output.x).toBe(300);
      expect(output.y).toBe(70);
      expect(output.width).toBe(120);
      expect(output.height).toBe(50);
      expect(output.inputs).toEqual(['A1', 'A2']);
      expect(output.position).toBe('right');
    });

    test('calculates borderMidpoints property correctly', () => {
      const output = new CalculatorOutput('A3', 300, 70, 120, 50, ['A1', 'A2'], 'right');
      const midpoints = output.borderMidpoints;
      
      expect(midpoints.topMid).toEqual({ x: 360, y: 70 });
      expect(midpoints.bottomMid).toEqual({ x: 360, y: 120 });
      expect(midpoints.leftMid).toEqual({ x: 300, y: 95 });
      expect(midpoints.rightMid).toEqual({ x: 420, y: 95 });
    });
  });

  describe('createEnhancedInputs', () => {
    test('creates enhanced inputs from layout', () => {
      const enhancedInputs = createEnhancedInputs(LEFT_COLUMN_LAYOUT);
      
      expect(enhancedInputs).toHaveLength(6);
      expect(enhancedInputs[0]).toBeInstanceOf(CalculatorInput);
      expect(enhancedInputs[0].id).toBe('A1');
      expect(enhancedInputs[0].position.topMid).toEqual({ x: 95, y: 25 }); // 25 + 140/2 = 95
    });
  });

  describe('createEnhancedOutputs', () => {
    test('creates enhanced outputs from layout', () => {
      const enhancedOutputs = createEnhancedOutputs(LEFT_COLUMN_LAYOUT);
      
      expect(enhancedOutputs).toHaveLength(4);
      expect(enhancedOutputs[0]).toBeInstanceOf(CalculatorOutput);
      expect(enhancedOutputs[0].id).toBe('A3');
      expect(enhancedOutputs[0].borderMidpoints.topMid).toEqual({ x: 360, y: 55 }); // 300 + 120/2 = 360, y = 55
    });
  });

  describe('getEnhancedInputById', () => {
    test('returns enhanced input for existing ID', () => {
      const input = getEnhancedInputById('A1', LEFT_COLUMN_LAYOUT);
      
      expect(input).not.toBeNull();
      expect(input!).toBeInstanceOf(CalculatorInput);
      expect(input!.id).toBe('A1');
      expect(input!.position.topMid).toEqual({ x: 95, y: 25 }); // 25 + 140/2 = 95
    });

    test('returns null for non-existing ID', () => {
      const input = getEnhancedInputById('NONEXISTENT', LEFT_COLUMN_LAYOUT);
      
      expect(input).toBeNull();
    });
  });

  describe('getEnhancedOutputById', () => {
    test('returns enhanced output for existing ID', () => {
      const output = getEnhancedOutputById('A3', LEFT_COLUMN_LAYOUT);
      
      expect(output).not.toBeNull();
      expect(output!).toBeInstanceOf(CalculatorOutput);
      expect(output!.id).toBe('A3');
      expect(output!.borderMidpoints.topMid).toEqual({ x: 360, y: 55 }); // 300 + 120/2 = 360, y = 55
    });

    test('returns null for non-existing ID', () => {
      const output = getEnhancedOutputById('NONEXISTENT', LEFT_COLUMN_LAYOUT);
      
      expect(output).toBeNull();
    });
  });
});