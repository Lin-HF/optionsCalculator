// Tests for line drawing utility functions
// Validates Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6

import { describe, it, expect } from 'vitest';
import { arrowLines, Llines } from './lineUtils';
import { BorderMidpoints } from './positionUtils';
import { getEnhancedInputById, getEnhancedOutputById, LEFT_COLUMN_LAYOUT } from '../config/calculatorConfig';

describe('Line Utils', () => {
  // Sample border midpoints for testing
  const input1Position: BorderMidpoints = {
    topMid: { x: 80, y: 25 },
    bottomMid: { x: 80, y: 105 },
    leftMid: { x: 25, y: 65 },
    rightMid: { x: 135, y: 65 }
  };

  const input2Position: BorderMidpoints = {
    topMid: { x: 80, y: 85 },
    bottomMid: { x: 80, y: 165 },
    leftMid: { x: 25, y: 125 },
    rightMid: { x: 135, y: 125 }
  };

  const outputPosition: BorderMidpoints = {
    topMid: { x: 360, y: 70 },
    bottomMid: { x: 360, y: 120 },
    leftMid: { x: 300, y: 95 },
    rightMid: { x: 420, y: 95 }
  };

  describe('arrowLines function', () => {
    it('should generate exactly 4 line segments', () => {
      const result = arrowLines(input1Position, input2Position, outputPosition);
      
      expect(result.lines).toHaveLength(4);
    });

    it('should create 3 horizontal and 1 vertical line', () => {
      const result = arrowLines(input1Position, input2Position, outputPosition);
      
      const horizontalLines = result.lines.filter(line => line.orientation === 'horizontal');
      const verticalLines = result.lines.filter(line => line.orientation === 'vertical');
      
      expect(horizontalLines).toHaveLength(3);
      expect(verticalLines).toHaveLength(1);
    });

    it('should calculate horizontal line length as 1/2 x-distance', () => {
      const result = arrowLines(input1Position, input2Position, outputPosition);
      
      // Expected x-distance: 300 - 135 = 165
      // Expected horizontal length: 165 / 2 = 82.5
      const expectedLength = (outputPosition.leftMid.x - Math.max(input1Position.rightMid.x, input2Position.rightMid.x)) / 2;
      
      // Check first horizontal line length
      const firstHorizontalLine = result.lines[0];
      const actualLength = Math.abs(firstHorizontalLine.x2 - firstHorizontalLine.x1);
      
      expect(actualLength).toBe(expectedLength);
    });

    it('should have proper connectivity between line segments', () => {
      const result = arrowLines(input1Position, input2Position, outputPosition);
      
      // a2 should connect to d1
      expect(result.connectionPoints.a2.x).toBe(result.connectionPoints.d1.x);
      expect(result.connectionPoints.a2.y).toBe(result.connectionPoints.d1.y);
      
      // b2 should connect to d2
      expect(result.connectionPoints.b2.x).toBe(result.connectionPoints.d2.x);
      expect(result.connectionPoints.b2.y).toBe(result.connectionPoints.d2.y);
      
      // c1 should be at midpoint of d1d2
      const expectedMidX = (result.connectionPoints.d1.x + result.connectionPoints.d2.x) / 2;
      const expectedMidY = (result.connectionPoints.d1.y + result.connectionPoints.d2.y) / 2;
      
      expect(result.connectionPoints.c1.x).toBe(expectedMidX);
      expect(result.connectionPoints.c1.y).toBe(expectedMidY);
    });

    it('should use appropriate border midpoints', () => {
      const result = arrowLines(input1Position, input2Position, outputPosition);
      
      // a1 should start at input1 rightMid
      expect(result.connectionPoints.a1.x).toBe(input1Position.rightMid.x);
      expect(result.connectionPoints.a1.y).toBe(input1Position.rightMid.y);
      
      // b1 should start at input2 rightMid
      expect(result.connectionPoints.b1.x).toBe(input2Position.rightMid.x);
      expect(result.connectionPoints.b1.y).toBe(input2Position.rightMid.y);
      
      // c2 should end at output leftMid
      expect(result.connectionPoints.c2.x).toBe(outputPosition.leftMid.x);
      expect(result.connectionPoints.c2.y).toBe(outputPosition.leftMid.y);
    });
  });

  describe('Llines function', () => {
    it('should generate exactly 2 line segments', () => {
      const result = Llines(input1Position, input2Position, 'bottomLeftCorner');
      
      expect(result.lines).toHaveLength(2);
    });

    it('should create 1 vertical and 1 horizontal line', () => {
      const result = Llines(input1Position, input2Position, 'bottomLeftCorner');
      
      const horizontalLines = result.lines.filter(line => line.orientation === 'horizontal');
      const verticalLines = result.lines.filter(line => line.orientation === 'vertical');
      
      expect(horizontalLines).toHaveLength(1);
      expect(verticalLines).toHaveLength(1);
    });

    it('should have v2 connect to h1 at corner point', () => {
      const result = Llines(input1Position, input2Position, 'bottomLeftCorner');
      
      // v2 endpoint should match h1 startpoint
      expect(result.connectionPoints.v2.x).toBe(result.connectionPoints.h1.x);
      expect(result.connectionPoints.v2.y).toBe(result.connectionPoints.h1.y);
    });

    it('should handle bottomLeftCorner rotation correctly', () => {
      const result = Llines(input1Position, input2Position, 'bottomLeftCorner');
      
      // v1 should start at input1 bottomMid
      expect(result.connectionPoints.v1.x).toBe(input1Position.bottomMid.x);
      expect(result.connectionPoints.v1.y).toBe(input1Position.bottomMid.y);
      
      // h2 should end at input2 leftMid
      expect(result.connectionPoints.h2.x).toBe(input2Position.leftMid.x);
      expect(result.connectionPoints.h2.y).toBe(input2Position.leftMid.y);
    });

    it('should handle bottomRightCorner rotation correctly', () => {
      const result = Llines(input1Position, input2Position, 'bottomRightCorner');
      
      // v1 should start at input1 bottomMid
      expect(result.connectionPoints.v1.x).toBe(input1Position.bottomMid.x);
      expect(result.connectionPoints.v1.y).toBe(input1Position.bottomMid.y);
      
      // h2 should end at input2 rightMid
      expect(result.connectionPoints.h2.x).toBe(input2Position.rightMid.x);
      expect(result.connectionPoints.h2.y).toBe(input2Position.rightMid.y);
    });

    it('should handle topLeftCorner rotation correctly', () => {
      const result = Llines(input1Position, input2Position, 'topLeftCorner');
      
      // v1 should start at input1 topMid
      expect(result.connectionPoints.v1.x).toBe(input1Position.topMid.x);
      expect(result.connectionPoints.v1.y).toBe(input1Position.topMid.y);
      
      // h2 should end at input2 leftMid
      expect(result.connectionPoints.h2.x).toBe(input2Position.leftMid.x);
      expect(result.connectionPoints.h2.y).toBe(input2Position.leftMid.y);
    });

    it('should handle topRightCorner rotation correctly', () => {
      const result = Llines(input1Position, input2Position, 'topRightCorner');
      
      // v1 should start at input1 topMid
      expect(result.connectionPoints.v1.x).toBe(input1Position.topMid.x);
      expect(result.connectionPoints.v1.y).toBe(input1Position.topMid.y);
      
      // h2 should end at input2 rightMid
      expect(result.connectionPoints.h2.x).toBe(input2Position.rightMid.x);
      expect(result.connectionPoints.h2.y).toBe(input2Position.rightMid.y);
    });

    it('should throw error for invalid rotation parameter', () => {
      expect(() => {
        // @ts-expect-error Testing invalid rotation parameter
        Llines(input1Position, input2Position, 'invalidRotation');
      }).toThrow('Invalid rotation parameter: invalidRotation');
    });
  });

  describe('A2,C1 → C2 Connection Integration', () => {
    it('should correctly connect A2 and C1 to C2 using Llines with bottomRightCorner rotation', () => {
      // Get actual positions from calculator configuration
      const a2Input = getEnhancedInputById('A2', LEFT_COLUMN_LAYOUT);
      const c1Input = getEnhancedInputById('C1', LEFT_COLUMN_LAYOUT);
      const c2Output = getEnhancedOutputById('C2', LEFT_COLUMN_LAYOUT);

      // Ensure all elements exist
      expect(a2Input).not.toBeNull();
      expect(c1Input).not.toBeNull();
      expect(c2Output).not.toBeNull();

      if (!a2Input || !c1Input || !c2Output) return;

      // Generate L-lines with bottomRightCorner rotation
      const result = Llines(a2Input.position, c1Input.position, 'bottomRightCorner');

      // Should generate exactly 2 line segments
      expect(result.lines).toHaveLength(2);

      // Should have 1 vertical and 1 horizontal line
      const verticalLines = result.lines.filter(line => line.orientation === 'vertical');
      const horizontalLines = result.lines.filter(line => line.orientation === 'horizontal');
      expect(verticalLines).toHaveLength(1);
      expect(horizontalLines).toHaveLength(1);

      // v1 should start at A2's bottomMid
      expect(result.connectionPoints.v1.x).toBe(a2Input.position.bottomMid.x);
      expect(result.connectionPoints.v1.y).toBe(a2Input.position.bottomMid.y);

      // h2 should end at C1's rightMid
      expect(result.connectionPoints.h2.x).toBe(c1Input.position.rightMid.x);
      expect(result.connectionPoints.h2.y).toBe(c1Input.position.rightMid.y);

      // v2 should connect to h1 at corner point
      expect(result.connectionPoints.v2.x).toBe(result.connectionPoints.h1.x);
      expect(result.connectionPoints.v2.y).toBe(result.connectionPoints.h1.y);

      // Corner should be at A2's x-coordinate and C1's y-coordinate
      expect(result.connectionPoints.v2.x).toBe(a2Input.position.bottomMid.x);
      expect(result.connectionPoints.v2.y).toBe(c1Input.position.rightMid.y);
    });
  });
});