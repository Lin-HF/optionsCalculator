// Property-based tests for position utility functions
// Validates Requirements 1.2, 1.3, 1.4, 1.5, 1.6

import * as fc from 'fast-check';
import { calculateBorderMidpoints, BorderMidpoints } from './positionUtils';

describe('Position Utils - Property Tests', () => {
  describe('calculateBorderMidpoints - Property 1: Border midpoint mathematical correctness', () => {
    // Create a generator for finite numbers only
    const finiteFloat = (min: number, max: number) => 
      fc.float({ min, max, noNaN: true, noDefaultInfinity: true });

    test('topMid is always at horizontal center and top edge', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // topMid should be at horizontal center and top edge
            expect(result.topMid.x).toBeCloseTo(x + width / 2);
            expect(result.topMid.y).toBeCloseTo(y);
          }
        )
      );
    });

    test('bottomMid is always at horizontal center and bottom edge', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // bottomMid should be at horizontal center and bottom edge
            expect(result.bottomMid.x).toBeCloseTo(x + width / 2);
            expect(result.bottomMid.y).toBeCloseTo(y + height);
          }
        )
      );
    });

    test('leftMid is always at vertical center and left edge', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // leftMid should be at vertical center and left edge
            expect(result.leftMid.x).toBeCloseTo(x);
            expect(result.leftMid.y).toBeCloseTo(y + height / 2);
          }
        )
      );
    });

    test('rightMid is always at vertical center and right edge', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // rightMid should be at vertical center and right edge
            expect(result.rightMid.x).toBeCloseTo(x + width);
            expect(result.rightMid.y).toBeCloseTo(y + height / 2);
          }
        )
      );
    });

    test('horizontal midpoints have same y-coordinate as vertical center', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            const verticalCenter = y + height / 2;
            
            // leftMid and rightMid should have same y-coordinate (vertical center)
            expect(result.leftMid.y).toBeCloseTo(verticalCenter);
            expect(result.rightMid.y).toBeCloseTo(verticalCenter);
          }
        )
      );
    });

    test('vertical midpoints have same x-coordinate as horizontal center', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            const horizontalCenter = x + width / 2;
            
            // topMid and bottomMid should have same x-coordinate (horizontal center)
            expect(result.topMid.x).toBeCloseTo(horizontalCenter);
            expect(result.bottomMid.x).toBeCloseTo(horizontalCenter);
          }
        )
      );
    });
  });

  describe('calculateBorderMidpoints - Property 2: Position object completeness', () => {
    // Create a generator for finite numbers only
    const finiteFloat = (min: number, max: number) => 
      fc.float({ min, max, noNaN: true, noDefaultInfinity: true });

    test('result always contains all required BorderMidpoints properties', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // Result should be a valid BorderMidpoints object
            expect(result).toBeDefined();
            expect(typeof result).toBe('object');
            
            // All required properties should exist
            expect(result).toHaveProperty('topMid');
            expect(result).toHaveProperty('bottomMid');
            expect(result).toHaveProperty('leftMid');
            expect(result).toHaveProperty('rightMid');
            
            // Each midpoint should have x and y coordinates
            ['topMid', 'bottomMid', 'leftMid', 'rightMid'].forEach(prop => {
              const midpoint = result[prop as keyof BorderMidpoints];
              expect(midpoint).toHaveProperty('x');
              expect(midpoint).toHaveProperty('y');
              expect(typeof midpoint.x).toBe('number');
              expect(typeof midpoint.y).toBe('number');
              expect(Number.isFinite(midpoint.x)).toBe(true);
              expect(Number.isFinite(midpoint.y)).toBe(true);
            });
          }
        )
      );
    });

    test('all coordinates are finite numbers', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // All coordinates should be finite numbers
            expect(Number.isFinite(result.topMid.x)).toBe(true);
            expect(Number.isFinite(result.topMid.y)).toBe(true);
            expect(Number.isFinite(result.bottomMid.x)).toBe(true);
            expect(Number.isFinite(result.bottomMid.y)).toBe(true);
            expect(Number.isFinite(result.leftMid.x)).toBe(true);
            expect(Number.isFinite(result.leftMid.y)).toBe(true);
            expect(Number.isFinite(result.rightMid.x)).toBe(true);
            expect(Number.isFinite(result.rightMid.y)).toBe(true);
          }
        )
      );
    });

    test('result structure matches BorderMidpoints interface exactly', () => {
      fc.assert(
        fc.property(
          finiteFloat(-1000, 1000), // x
          finiteFloat(-1000, 1000), // y
          finiteFloat(0, 1000),     // width
          finiteFloat(0, 1000),     // height
          (x, y, width, height) => {
            const result = calculateBorderMidpoints(x, y, width, height);
            
            // Should have exactly 4 properties (no extra properties)
            const keys = Object.keys(result);
            expect(keys).toHaveLength(4);
            expect(keys.sort()).toEqual(['bottomMid', 'leftMid', 'rightMid', 'topMid']);
            
            // Each property should have exactly x and y (no extra properties)
            ['topMid', 'bottomMid', 'leftMid', 'rightMid'].forEach(prop => {
              const midpoint = result[prop as keyof BorderMidpoints];
              const midpointKeys = Object.keys(midpoint);
              expect(midpointKeys).toHaveLength(2);
              expect(midpointKeys.sort()).toEqual(['x', 'y']);
            });
          }
        )
      );
    });
  });
});