import { describe, it, expect } from 'vitest';
import {
  CALCULATIONS,
  LEFT_COLUMN_LAYOUT,
  MIDDLE_COLUMN_LAYOUT,
  RIGHT_COLUMN_LAYOUT,
  COLUMN_LAYOUTS,
  getAllInputIds,
  getCalculationByOutputId,
  getLayoutByColumnIndex,
  validateConfiguration
} from './calculatorConfig';

describe('Calculator Configuration', () => {
  describe('CALCULATIONS object', () => {
    it('should contain all expected calculation configurations', () => {
      expect(CALCULATIONS).toBeDefined();
      expect(Object.keys(CALCULATIONS)).toHaveLength(10);
      
      // Check left column calculations
      expect(CALCULATIONS.A3).toEqual({ inputs: ['A1', 'A2'], position: 'right' });
      expect(CALCULATIONS.C2).toEqual({ inputs: ['A2', 'C1'], position: 'left' });
      expect(CALCULATIONS.E3).toEqual({ inputs: ['E1', 'E2'], position: 'right' });
      expect(CALCULATIONS.F2).toEqual({ inputs: ['E1', 'F1'], position: 'left' });
      
      // Check middle column calculations
      expect(CALCULATIONS.B3).toEqual({ inputs: ['B1', 'B2'], position: 'right' });
      expect(CALCULATIONS.D2).toEqual({ inputs: ['B2', 'D1'], position: 'left' });
      expect(CALCULATIONS.H3).toEqual({ inputs: ['H1', 'H2'], position: 'right' });
      expect(CALCULATIONS.G2).toEqual({ inputs: ['G1', 'H1'], position: 'left' });
      
      // Check right column calculations
      expect(CALCULATIONS.I3).toEqual({ inputs: ['I1', 'I2'], position: 'right' });
      expect(CALCULATIONS.J3).toEqual({ inputs: ['J1', 'J2'], position: 'right' });
    });
  });

  describe('Column layout configurations', () => {
    it('should have correct left column layout', () => {
      expect(LEFT_COLUMN_LAYOUT.weekOffset).toBe(0);
      expect(LEFT_COLUMN_LAYOUT.inputs).toHaveLength(6);
      expect(LEFT_COLUMN_LAYOUT.outputs).toHaveLength(4);
      
      // Check input positions
      const inputIds = LEFT_COLUMN_LAYOUT.inputs.map(input => input.id);
      expect(inputIds).toEqual(['A1', 'A2', 'C1', 'E1', 'E2', 'F1']);
      
      // Check output configurations
      const outputIds = LEFT_COLUMN_LAYOUT.outputs.map(output => output.id);
      expect(outputIds).toEqual(['A3', 'C2', 'E3', 'F2']);
    });

    it('should have correct middle column layout', () => {
      expect(MIDDLE_COLUMN_LAYOUT.weekOffset).toBe(1);
      expect(MIDDLE_COLUMN_LAYOUT.inputs).toHaveLength(6);
      expect(MIDDLE_COLUMN_LAYOUT.outputs).toHaveLength(4);
      
      // Check input positions
      const inputIds = MIDDLE_COLUMN_LAYOUT.inputs.map(input => input.id);
      expect(inputIds).toEqual(['B1', 'B2', 'D1', 'G1', 'H1', 'H2']);
      
      // Check output configurations
      const outputIds = MIDDLE_COLUMN_LAYOUT.outputs.map(output => output.id);
      expect(outputIds).toEqual(['B3', 'D2', 'G2', 'H3']);
    });

    it('should have correct right column layout', () => {
      expect(RIGHT_COLUMN_LAYOUT.weekOffset).toBe(2);
      expect(RIGHT_COLUMN_LAYOUT.inputs).toHaveLength(4);
      expect(RIGHT_COLUMN_LAYOUT.outputs).toHaveLength(2);
      
      // Check input positions
      const inputIds = RIGHT_COLUMN_LAYOUT.inputs.map(input => input.id);
      expect(inputIds).toEqual(['I1', 'I2', 'J1', 'J2']);
      
      // Check output configurations
      const outputIds = RIGHT_COLUMN_LAYOUT.outputs.map(output => output.id);
      expect(outputIds).toEqual(['I3', 'J3']);
    });
  });

  describe('COLUMN_LAYOUTS array', () => {
    it('should contain all three column layouts', () => {
      expect(COLUMN_LAYOUTS).toHaveLength(3);
      expect(COLUMN_LAYOUTS[0]).toBe(LEFT_COLUMN_LAYOUT);
      expect(COLUMN_LAYOUTS[1]).toBe(MIDDLE_COLUMN_LAYOUT);
      expect(COLUMN_LAYOUTS[2]).toBe(RIGHT_COLUMN_LAYOUT);
    });
  });

  describe('Helper functions', () => {
    it('should get all input IDs correctly', () => {
      const inputIds = getAllInputIds();
      expect(inputIds).toContain('A1');
      expect(inputIds).toContain('A2');
      expect(inputIds).toContain('C1');
      expect(inputIds).toContain('E1');
      expect(inputIds).toContain('E2');
      expect(inputIds).toContain('F1');
      expect(inputIds).toContain('B1');
      expect(inputIds).toContain('B2');
      expect(inputIds).toContain('D1');
      expect(inputIds).toContain('G1');
      expect(inputIds).toContain('H1');
      expect(inputIds).toContain('H2');
      expect(inputIds).toContain('I1');
      expect(inputIds).toContain('I2');
      expect(inputIds).toContain('J1');
      expect(inputIds).toContain('J2');
      expect(inputIds).toHaveLength(16);
    });

    it('should get calculation by output ID', () => {
      const calc = getCalculationByOutputId('A3');
      expect(calc).toEqual({ inputs: ['A1', 'A2'], position: 'right' });
    });

    it('should get layout by column index', () => {
      expect(getLayoutByColumnIndex(0)).toBe(LEFT_COLUMN_LAYOUT);
      expect(getLayoutByColumnIndex(1)).toBe(MIDDLE_COLUMN_LAYOUT);
      expect(getLayoutByColumnIndex(2)).toBe(RIGHT_COLUMN_LAYOUT);
    });

    it('should handle invalid column index gracefully', () => {
      const invalidLayout = getLayoutByColumnIndex(999);
      expect(invalidLayout.inputs).toHaveLength(0);
      expect(invalidLayout.outputs).toHaveLength(0);
      expect(invalidLayout.weekOffset).toBe(0);
    });

    it('should validate configuration successfully', () => {
      expect(validateConfiguration()).toBe(true);
    });
  });

  describe('Configuration consistency', () => {
    it('should have matching inputs between CALCULATIONS and column layouts', () => {
      // Collect all inputs from CALCULATIONS
      const calculationInputs = new Set<string>();
      Object.values(CALCULATIONS).forEach(calc => {
        calc.inputs.forEach(input => calculationInputs.add(input));
      });

      // Collect all inputs from column layouts
      const layoutInputs = new Set<string>();
      COLUMN_LAYOUTS.forEach(layout => {
        layout.inputs.forEach(input => {
          layoutInputs.add(input.id);
        });
      });

      // They should be identical
      expect(calculationInputs.size).toBe(layoutInputs.size);
      calculationInputs.forEach(input => {
        expect(layoutInputs.has(input)).toBe(true);
      });
    });

    it('should have matching outputs between CALCULATIONS and column layouts', () => {
      // Collect all output IDs from CALCULATIONS
      const calculationOutputs = new Set(Object.keys(CALCULATIONS));

      // Collect all output IDs from column layouts
      const layoutOutputs = new Set<string>();
      COLUMN_LAYOUTS.forEach(layout => {
        layout.outputs.forEach(output => {
          layoutOutputs.add(output.id);
        });
      });

      // They should be identical
      expect(calculationOutputs.size).toBe(layoutOutputs.size);
      calculationOutputs.forEach(output => {
        expect(layoutOutputs.has(output)).toBe(true);
      });
    });

    it('should have consistent shared inputs', () => {
      // Verify that shared inputs appear in the correct layouts
      // A2 should be in left column and used by both A3 and C2
      const leftLayout = getLayoutByColumnIndex(0);
      const a2Input = leftLayout.inputs.find(input => input.id === 'A2');
      expect(a2Input).toBeDefined();
      
      const a3Output = leftLayout.outputs.find(output => output.id === 'A3');
      const c2Output = leftLayout.outputs.find(output => output.id === 'C2');
      expect(a3Output?.inputs).toContain('A2');
      expect(c2Output?.inputs).toContain('A2');
      
      // E1 should be in left column and used by both E3 and F2
      const e1Input = leftLayout.inputs.find(input => input.id === 'E1');
      expect(e1Input).toBeDefined();
      
      const e3Output = leftLayout.outputs.find(output => output.id === 'E3');
      const f2Output = leftLayout.outputs.find(output => output.id === 'F2');
      expect(e3Output?.inputs).toContain('E1');
      expect(f2Output?.inputs).toContain('E1');
    });
  });
});