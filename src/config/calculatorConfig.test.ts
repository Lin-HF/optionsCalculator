import { describe, it, expect } from 'vitest';
import {
  CALCULATIONS,
  LEFT_COLUMN_GROUPS,
  MIDDLE_COLUMN_GROUPS,
  RIGHT_COLUMN_GROUPS,
  COLUMN_CONFIGURATIONS,
  getAllInputIds,
  getCalculationByOutputId,
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

  describe('Column group configurations', () => {
    it('should have correct left column groups', () => {
      expect(LEFT_COLUMN_GROUPS).toHaveLength(4);
      expect(LEFT_COLUMN_GROUPS[0]).toEqual({
        input1Id: 'A1',
        input2Id: 'A2',
        outputs: [{ id: 'A3', position: 'right', inputs: ['A1', 'A2'] }]
      });
    });

    it('should have correct middle column groups', () => {
      expect(MIDDLE_COLUMN_GROUPS).toHaveLength(4);
      expect(MIDDLE_COLUMN_GROUPS[0]).toEqual({
        input1Id: 'B1',
        input2Id: 'B2',
        outputs: [{ id: 'B3', position: 'right', inputs: ['B1', 'B2'] }]
      });
    });

    it('should have correct right column groups', () => {
      expect(RIGHT_COLUMN_GROUPS).toHaveLength(2);
      expect(RIGHT_COLUMN_GROUPS[0]).toEqual({
        input1Id: 'I1',
        input2Id: 'I2',
        outputs: [{ id: 'I3', position: 'right', inputs: ['I1', 'I2'] }]
      });
    });
  });

  describe('COLUMN_CONFIGURATIONS', () => {
    it('should contain all three columns with correct configuration', () => {
      expect(COLUMN_CONFIGURATIONS).toHaveLength(3);
      
      expect(COLUMN_CONFIGURATIONS[0]).toEqual({
        weekOffset: 0,
        groups: LEFT_COLUMN_GROUPS,
        title: '本周五'
      });
      
      expect(COLUMN_CONFIGURATIONS[1]).toEqual({
        weekOffset: 1,
        groups: MIDDLE_COLUMN_GROUPS,
        title: '下周五'
      });
      
      expect(COLUMN_CONFIGURATIONS[2]).toEqual({
        weekOffset: 2,
        groups: RIGHT_COLUMN_GROUPS,
        title: '下下周五'
      });
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

    it('should validate configuration successfully', () => {
      expect(validateConfiguration()).toBe(true);
    });
  });

  describe('Configuration consistency', () => {
    it('should have matching inputs between CALCULATIONS and column groups', () => {
      // Collect all inputs from CALCULATIONS
      const calculationInputs = new Set<string>();
      Object.values(CALCULATIONS).forEach(calc => {
        calc.inputs.forEach(input => calculationInputs.add(input));
      });

      // Collect all inputs from column groups
      const groupInputs = new Set<string>();
      [LEFT_COLUMN_GROUPS, MIDDLE_COLUMN_GROUPS, RIGHT_COLUMN_GROUPS].forEach(groups => {
        groups.forEach(group => {
          groupInputs.add(group.input1Id);
          groupInputs.add(group.input2Id);
        });
      });

      // They should be identical
      expect(calculationInputs.size).toBe(groupInputs.size);
      calculationInputs.forEach(input => {
        expect(groupInputs.has(input)).toBe(true);
      });
    });

    it('should have matching outputs between CALCULATIONS and column groups', () => {
      // Collect all output IDs from CALCULATIONS
      const calculationOutputs = new Set(Object.keys(CALCULATIONS));

      // Collect all output IDs from column groups
      const groupOutputs = new Set<string>();
      [LEFT_COLUMN_GROUPS, MIDDLE_COLUMN_GROUPS, RIGHT_COLUMN_GROUPS].forEach(groups => {
        groups.forEach(group => {
          group.outputs.forEach(output => {
            groupOutputs.add(output.id);
          });
        });
      });

      // They should be identical
      expect(calculationOutputs.size).toBe(groupOutputs.size);
      calculationOutputs.forEach(output => {
        expect(groupOutputs.has(output)).toBe(true);
      });
    });
  });
});