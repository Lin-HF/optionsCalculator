/**
 * Tests for calculation utilities
 */

import { calculateAverage, formatNumber, calculateAndFormatAverage } from './calculationUtils';
import * as fc from 'fast-check';

describe('calculationUtils', () => {
  describe('calculateAverage', () => {
    it('should calculate average of two positive numbers', () => {
      expect(calculateAverage(10, 20)).toBe(15);
      expect(calculateAverage(5, 15)).toBe(10);
      expect(calculateAverage(100, 200)).toBe(150);
    });

    it('should handle zero values', () => {
      expect(calculateAverage(0, 10)).toBe(5);
      expect(calculateAverage(10, 0)).toBe(5);
      expect(calculateAverage(0, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(calculateAverage(-10, 10)).toBe(0);
      expect(calculateAverage(-5, -15)).toBe(-10);
      expect(calculateAverage(-100, 50)).toBe(-25);
    });

    it('should handle decimal numbers', () => {
      expect(calculateAverage(1.5, 2.5)).toBe(2);
      expect(calculateAverage(3.33, 6.67)).toBe(5);
      expect(calculateAverage(0.1, 0.2)).toBeCloseTo(0.15);
    });

    it('should treat undefined/null as zero', () => {
      expect(calculateAverage(undefined as any, 10)).toBe(5);
      expect(calculateAverage(10, null as any)).toBe(5);
      expect(calculateAverage(undefined as any, null as any)).toBe(0);
    });
  });

  describe('formatNumber', () => {
    it('should format integers without decimals', () => {
      expect(formatNumber(10)).toBe('10');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(100)).toBe('100');
    });

    it('should format decimals with appropriate precision', () => {
      expect(formatNumber(10.5)).toBe('10.5');
      expect(formatNumber(10.50)).toBe('10.5');
      expect(formatNumber(10.123)).toBe('10.12');
      expect(formatNumber(10.999)).toBe('11');
    });

    it('should handle custom decimal places', () => {
      expect(formatNumber(10.123, 1)).toBe('10.1');
      expect(formatNumber(10.123, 3)).toBe('10.123');
      expect(formatNumber(10.999, 0)).toBe('11');
    });

    it('should handle edge cases', () => {
      expect(formatNumber(NaN)).toBe('0');
      expect(formatNumber(Infinity)).toBe('0');
      expect(formatNumber(-Infinity)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-10.5)).toBe('-10.5');
      expect(formatNumber(-10.123)).toBe('-10.12');
    });
  });

  describe('calculateAndFormatAverage', () => {
    it('should calculate and format average in one step', () => {
      expect(calculateAndFormatAverage(10, 20)).toBe('15');
      expect(calculateAndFormatAverage(1, 2)).toBe('1.5');
      expect(calculateAndFormatAverage(10.123, 20.456)).toBe('15.29');
    });

    it('should handle custom decimal places', () => {
      expect(calculateAndFormatAverage(10.123, 20.456, 1)).toBe('15.3');
      expect(calculateAndFormatAverage(10.123, 20.456, 3)).toBe('15.29');
    });
  });

  // Property-based tests
  describe('Property-based tests', () => {
    /**
     * **Feature: price-calculator, Property 2: Average value calculation correctness**
     * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2**
     */
    it('Property 2: For any two number inputs, calculated average should equal sum divided by 2', () => {
      fc.assert(fc.property(
        fc.float({ min: -1000000, max: 1000000, noNaN: true }),
        fc.float({ min: -1000000, max: 1000000, noNaN: true }),
        (value1, value2) => {
          const result = calculateAverage(value1, value2);
          const expected = (value1 + value2) / 2;
          
          // Use close comparison for floating point numbers
          expect(Math.abs(result - expected)).toBeLessThan(1e-10);
        }
      ), { numRuns: 100 });
    });

    /**
     * **Feature: price-calculator, Property 4: Decimal precision maintenance**
     * **Validates: Requirements 7.4**
     */
    it('Property 4: For any decimal input values, calculation results should maintain appropriate mathematical precision', () => {
      fc.assert(fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        (value1, value2) => {
          const result = calculateAverage(value1, value2);
          const expected = (value1 + value2) / 2;
          
          // Verify that the calculation maintains mathematical precision
          // The difference should be within floating point precision limits
          const precision = Math.max(
            Math.abs(value1) * Number.EPSILON,
            Math.abs(value2) * Number.EPSILON,
            Number.EPSILON
          ) * 10; // Allow for some computational tolerance
          
          expect(Math.abs(result - expected)).toBeLessThan(precision);
          
          // Verify that the result is a finite number
          expect(isFinite(result)).toBe(true);
          expect(isNaN(result)).toBe(false);
        }
      ), { numRuns: 100 });
    });

    /**
     * **Feature: price-calculator, Property 5: Result formatting consistency**
     * **Validates: Requirements 7.5**
     */
    it('Property 5: For any calculation result, displayed decimal places should not exceed 2 digits and format should be consistent', () => {
      fc.assert(fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        (value1, value2) => {
          const average = calculateAverage(value1, value2);
          const formatted = formatNumber(average, 2);
          
          // Verify the formatted result is a valid number string
          expect(typeof formatted).toBe('string');
          expect(formatted).toMatch(/^-?\d+(\.\d{1,2})?$/);
          
          // Verify that decimal places don't exceed 2
          const decimalPart = formatted.split('.')[1];
          if (decimalPart) {
            expect(decimalPart.length).toBeLessThanOrEqual(2);
          }
          
          // Verify that the formatted string can be parsed back to a number
          const parsedBack = parseFloat(formatted);
          expect(isFinite(parsedBack)).toBe(true);
          expect(isNaN(parsedBack)).toBe(false);
          
          // Verify consistency: formatting the same number should always give the same result
          const formatted2 = formatNumber(average, 2);
          expect(formatted).toBe(formatted2);
          
          // Verify that trailing zeros are removed (consistency requirement)
          expect(formatted).not.toMatch(/\.0+$/);
          expect(formatted).not.toMatch(/\.\d*0+$/);
        }
      ), { numRuns: 100 });
    });
  });
});