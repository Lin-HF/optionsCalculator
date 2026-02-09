import { describe, it, expect } from 'vitest';
import { 
  validateInputPair, 
  validateAllInputPairs, 
  getErrorForPair,
  INPUT_PAIRS 
} from './validationUtils';

describe('Validation Utils', () => {
  describe('validateInputPair', () => {
    it('should return null for valid pair (first > second)', () => {
      const result = validateInputPair('A1', 'A2', 20, 10);
      expect(result).toBeNull();
    });

    it('should return error when first <= second', () => {
      const result = validateInputPair('A1', 'A2', 10, 20);
      expect(result).not.toBeNull();
      expect(result?.message).toBe('Value must be smaller than $20.00');
      expect(result?.pairId).toBe('A1-A2');
    });

    it('should return error when first equals second', () => {
      const result = validateInputPair('A1', 'A2', 15, 15);
      expect(result).not.toBeNull();
      expect(result?.message).toBe('Value must be smaller than $15.00');
    });

    it('should return null when first value is 0 (empty)', () => {
      const result = validateInputPair('A1', 'A2', 0, 20);
      expect(result).toBeNull();
    });

    it('should return null when second value is 0 (empty)', () => {
      const result = validateInputPair('A1', 'A2', 10, 0);
      expect(result).toBeNull();
    });

    it('should return null when both values are 0', () => {
      const result = validateInputPair('A1', 'A2', 0, 0);
      expect(result).toBeNull();
    });

    it('should work with negative values', () => {
      const result1 = validateInputPair('A1', 'A2', -10, -20);
      expect(result1).toBeNull();

      const result2 = validateInputPair('A1', 'A2', -20, -10);
      expect(result2).not.toBeNull();
    });

    it('should work with decimal values', () => {
      const result1 = validateInputPair('A1', 'A2', 10.6, 10.5);
      expect(result1).toBeNull();

      const result2 = validateInputPair('A1', 'A2', 10.5, 10.6);
      expect(result2).not.toBeNull();
    });
  });

  describe('validateAllInputPairs', () => {
    it('should return empty array when all pairs are valid', () => {
      const inputValues = {
        A1: 20, A2: 10,
        B1: 25, B2: 15,
        I1: 10, I2: 5,
        E1: 40, E2: 30,
        H1: 18, H2: 12,
        J1: 16, J2: 8
      };

      const errors = validateAllInputPairs(inputValues);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid pairs', () => {
      const inputValues = {
        A1: 10, A2: 20, // Invalid
        B1: 25, B2: 15, // Valid
        I1: 5, I2: 10,  // Invalid
        E1: 40, E2: 30, // Valid
        H1: 12, H2: 18, // Invalid
        J1: 16, J2: 8   // Valid
      };

      const errors = validateAllInputPairs(inputValues);
      expect(errors).toHaveLength(3);
      expect(errors.map(e => e.pairId)).toContain('A1-A2');
      expect(errors.map(e => e.pairId)).toContain('I1-I2');
      expect(errors.map(e => e.pairId)).toContain('H1-H2');
    });

    it('should skip validation for pairs with empty values', () => {
      const inputValues = {
        A1: 0, A2: 20,  // Skip (first is empty)
        B1: 15, B2: 0,  // Skip (second is empty)
        I1: 0, I2: 0,   // Skip (both empty)
        E1: 40, E2: 30, // Valid
        H1: 12, H2: 18, // Invalid
        J1: 16, J2: 8   // Valid
      };

      const errors = validateAllInputPairs(inputValues);
      expect(errors).toHaveLength(1);
      expect(errors[0].pairId).toBe('H1-H2');
    });

    it('should validate all defined input pairs', () => {
      expect(INPUT_PAIRS).toHaveLength(6);
      expect(INPUT_PAIRS).toContainEqual(['A1', 'A2']);
      expect(INPUT_PAIRS).toContainEqual(['B1', 'B2']);
      expect(INPUT_PAIRS).toContainEqual(['I1', 'I2']);
      expect(INPUT_PAIRS).toContainEqual(['E1', 'E2']);
      expect(INPUT_PAIRS).toContainEqual(['H1', 'H2']);
      expect(INPUT_PAIRS).toContainEqual(['J1', 'J2']);
    });
  });

  describe('getErrorForPair', () => {
    it('should return error for matching pair', () => {
      const errors = [
        { pairId: 'A1-A2', message: 'Value must be smaller than $20.00', firstInput: 'A1', secondInput: 'A2' },
        { pairId: 'B1-B2', message: 'Value must be smaller than $25.00', firstInput: 'B1', secondInput: 'B2' }
      ];

      const error = getErrorForPair(errors, 'A1', 'A2');
      expect(error).not.toBeNull();
      expect(error?.pairId).toBe('A1-A2');
    });

    it('should return null for non-matching pair', () => {
      const errors = [
        { pairId: 'A1-A2', message: 'Value must be smaller than $20.00', firstInput: 'A1', secondInput: 'A2' }
      ];

      const error = getErrorForPair(errors, 'B1', 'B2');
      expect(error).toBeNull();
    });

    it('should return null for empty errors array', () => {
      const error = getErrorForPair([], 'A1', 'A2');
      expect(error).toBeNull();
    });
  });
});
