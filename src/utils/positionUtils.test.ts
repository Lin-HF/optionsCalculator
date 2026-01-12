// Tests for position utility functions
// Validates Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6

import { 
  calculateBorderMidpoints, 
  getInputPositions, 
  getOutputPositions,
  BorderMidpoints 
} from './positionUtils';
import { LEFT_COLUMN_LAYOUT } from '../config/calculatorConfig';

describe('Position Utils', () => {
  describe('calculateBorderMidpoints', () => {
    test('calculates correct border midpoints for basic rectangle', () => {
      const result = calculateBorderMidpoints(10, 20, 100, 80);
      
      expect(result.topMid).toEqual({ x: 60, y: 20 });
      expect(result.bottomMid).toEqual({ x: 60, y: 100 });
      expect(result.leftMid).toEqual({ x: 10, y: 60 });
      expect(result.rightMid).toEqual({ x: 110, y: 60 });
    });

    test('calculates correct border midpoints for square', () => {
      const result = calculateBorderMidpoints(0, 0, 50, 50);
      
      expect(result.topMid).toEqual({ x: 25, y: 0 });
      expect(result.bottomMid).toEqual({ x: 25, y: 50 });
      expect(result.leftMid).toEqual({ x: 0, y: 25 });
      expect(result.rightMid).toEqual({ x: 50, y: 25 });
    });

    test('handles zero dimensions gracefully', () => {
      const result = calculateBorderMidpoints(10, 10, 0, 0);
      
      expect(result.topMid).toEqual({ x: 10, y: 10 });
      expect(result.bottomMid).toEqual({ x: 10, y: 10 });
      expect(result.leftMid).toEqual({ x: 10, y: 10 });
      expect(result.rightMid).toEqual({ x: 10, y: 10 });
    });

    test('handles negative coordinates', () => {
      const result = calculateBorderMidpoints(-10, -20, 100, 80);
      
      expect(result.topMid).toEqual({ x: 40, y: -20 });
      expect(result.bottomMid).toEqual({ x: 40, y: 60 });
      expect(result.leftMid).toEqual({ x: -10, y: 20 });
      expect(result.rightMid).toEqual({ x: 90, y: 20 });
    });
  });

  describe('getInputPositions', () => {
    test('returns correct positions for existing input', () => {
      const result = getInputPositions('A1', LEFT_COLUMN_LAYOUT);
      
      expect(result).not.toBeNull();
      expect(result!.topMid).toEqual({ x: 95, y: 25 }); // 25 + 140/2 = 95
      expect(result!.bottomMid).toEqual({ x: 95, y: 73 }); // 25 + 48 = 73
      expect(result!.leftMid).toEqual({ x: 25, y: 49 }); // 25 + 48/2 = 49
      expect(result!.rightMid).toEqual({ x: 165, y: 49 }); // 25 + 140 = 165
    });

    test('returns null for non-existing input', () => {
      const result = getInputPositions('NONEXISTENT', LEFT_COLUMN_LAYOUT);
      
      expect(result).toBeNull();
    });
  });

  describe('getOutputPositions', () => {
    test('returns correct positions for existing output', () => {
      const result = getOutputPositions('A3', LEFT_COLUMN_LAYOUT);
      
      expect(result).not.toBeNull();
      expect(result!.topMid).toEqual({ x: 360, y: 55 }); // 300 + 120/2 = 360
      expect(result!.bottomMid).toEqual({ x: 360, y: 105 }); // 55 + 50 = 105
      expect(result!.leftMid).toEqual({ x: 300, y: 80 }); // 55 + 50/2 = 80
      expect(result!.rightMid).toEqual({ x: 420, y: 80 }); // 300 + 120 = 420
    });

    test('returns null for non-existing output', () => {
      const result = getOutputPositions('NONEXISTENT', LEFT_COLUMN_LAYOUT);
      
      expect(result).toBeNull();
    });
  });

  describe('BorderMidpoints interface', () => {
    test('contains all required properties', () => {
      const midpoints: BorderMidpoints = {
        topMid: { x: 0, y: 0 },
        bottomMid: { x: 0, y: 0 },
        leftMid: { x: 0, y: 0 },
        rightMid: { x: 0, y: 0 }
      };
      
      expect(midpoints).toHaveProperty('topMid');
      expect(midpoints).toHaveProperty('bottomMid');
      expect(midpoints).toHaveProperty('leftMid');
      expect(midpoints).toHaveProperty('rightMid');
      
      expect(midpoints.topMid).toHaveProperty('x');
      expect(midpoints.topMid).toHaveProperty('y');
    });
  });
});