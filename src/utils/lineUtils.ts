// Line drawing utility functions for graph connections
// Implements Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6

import { BorderMidpoints } from './positionUtils';

/**
 * Interface representing a line segment with start and end coordinates
 */
export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  orientation: 'horizontal' | 'vertical';
}

/**
 * Interface representing the result of arrowLines function
 */
export interface ArrowLinesResult {
  lines: LineSegment[];
  connectionPoints: {
    a1: { x: number; y: number };
    a2: { x: number; y: number };
    b1: { x: number; y: number };
    b2: { x: number; y: number };
    c1: { x: number; y: number };
    c2: { x: number; y: number };
    d1: { x: number; y: number };
    d2: { x: number; y: number };
  };
}

/**
 * ArrowLines function that connects two inputs to one output using a standardized arrow pattern
 * Creates 4 line segments: 3 horizontal (a1a2, b1b2, c1c2) and 1 vertical (d1d2)
 * 
 * Connection logic:
 * - a1 starts at input1Position (rightMid)
 * - a2 connects to d1 (vertical line start)
 * - b1 starts at input2Position (rightMid)  
 * - b2 connects to d2 (vertical line end)
 * - c1 connects to midpoint of d1d2
 * - c2 ends at outputPosition (leftMid)
 * 
 * @param input1Position - Border midpoints of first input element
 * @param input2Position - Border midpoints of second input element
 * @param outputPosition - Border midpoints of output element
 * @returns ArrowLinesResult containing line segments and connection points
 */
export function arrowLines(
  input1Position: BorderMidpoints,
  input2Position: BorderMidpoints,
  outputPosition: BorderMidpoints
): ArrowLinesResult {
  // Select appropriate border midpoints based on relative positions
  // Inputs typically connect from their right side, output from its left side
  const input1Point = input1Position.rightMid;
  const input2Point = input2Position.rightMid;
  const outputPoint = outputPosition.leftMid;
  
  // Calculate horizontal line length as 1/2 of x-distance between inputs and output
  const xDistance = outputPoint.x - Math.max(input1Point.x, input2Point.x);
  const horizontalLength = xDistance / 2;
  
  // Calculate connection points
  const a1 = { x: input1Point.x, y: input1Point.y };
  const a2 = { x: input1Point.x + horizontalLength, y: input1Point.y };
  
  const b1 = { x: input2Point.x, y: input2Point.y };
  const b2 = { x: input2Point.x + horizontalLength, y: input2Point.y };
  
  // Vertical line connects a2 to b2
  const d1 = { x: a2.x, y: a2.y };
  const d2 = { x: b2.x, y: b2.y };
  
  // Third horizontal line connects from midpoint of vertical line to output
  const verticalMidpoint = {
    x: (d1.x + d2.x) / 2,
    y: (d1.y + d2.y) / 2
  };
  
  const c1 = { x: verticalMidpoint.x, y: verticalMidpoint.y };
  const c2 = { x: outputPoint.x, y: outputPoint.y };
  
  // Create line segments
  const lines: LineSegment[] = [
    // First horizontal line (a1 → a2)
    {
      x1: a1.x,
      y1: a1.y,
      x2: a2.x,
      y2: a2.y,
      orientation: 'horizontal'
    },
    // Second horizontal line (b1 → b2)
    {
      x1: b1.x,
      y1: b1.y,
      x2: b2.x,
      y2: b2.y,
      orientation: 'horizontal'
    },
    // Vertical line (d1 → d2)
    {
      x1: d1.x,
      y1: d1.y,
      x2: d2.x,
      y2: d2.y,
      orientation: 'vertical'
    },
    // Third horizontal line (c1 → c2)
    {
      x1: c1.x,
      y1: c1.y,
      x2: c2.x,
      y2: c2.y,
      orientation: 'horizontal'
    }
  ];
  
  return {
    lines,
    connectionPoints: {
      a1,
      a2,
      b1,
      b2,
      c1,
      c2,
      d1,
      d2
    }
  };
}

/**
 * Type definition for L-line rotation options
 */
export type LlineRotation = 'bottomLeftCorner' | 'bottomRightCorner' | 'topLeftCorner' | 'topRightCorner';

/**
 * Interface representing the result of Llines function
 */
export interface LlinesResult {
  lines: LineSegment[];
  connectionPoints: {
    v1: { x: number; y: number };
    v2: { x: number; y: number };
    h1: { x: number; y: number };
    h2: { x: number; y: number };
  };
}

/**
 * Llines function that connects two points using an L-shaped pattern
 * Creates 2 line segments: 1 vertical (v1v2) and 1 horizontal (h1h2)
 * The v2 endpoint connects to h1 startpoint at the corner
 * 
 * @param input1Position - Border midpoints of first input element
 * @param input2Position - Border midpoints of second input element  
 * @param rotation - Corner orientation (bottomLeftCorner, bottomRightCorner, topLeftCorner, topRightCorner)
 * @returns LlinesResult containing line segments and connection points
 */
export function Llines(
  input1Position: BorderMidpoints,
  input2Position: BorderMidpoints,
  rotation: LlineRotation
): LlinesResult {
  // Select appropriate border midpoints based on rotation
  let input1Point: { x: number; y: number };
  let input2Point: { x: number; y: number };
  
  switch (rotation) {
    case 'bottomLeftCorner':
      input1Point = input1Position.bottomMid;
      input2Point = input2Position.leftMid;
      break;
    case 'bottomRightCorner':
      input1Point = input1Position.bottomMid;
      input2Point = input2Position.rightMid;
      break;
    case 'topLeftCorner':
      input1Point = input1Position.topMid;
      input2Point = input2Position.leftMid;
      break;
    case 'topRightCorner':
      input1Point = input1Position.topMid;
      input2Point = input2Position.rightMid;
      break;
    default:
      throw new Error(`Invalid rotation parameter: ${rotation}`);
  }
  
  // Calculate connection points for L-shape
  // v1 starts at input1Point, v2/h1 is the corner, h2 ends at input2Point
  const v1 = { x: input1Point.x, y: input1Point.y };
  const corner = { x: input1Point.x, y: input2Point.y };
  const v2 = corner;
  const h1 = corner;
  const h2 = { x: input2Point.x, y: input2Point.y };
  
  // Create line segments
  const lines: LineSegment[] = [
    // Vertical line (v1 → v2)
    {
      x1: v1.x,
      y1: v1.y,
      x2: v2.x,
      y2: v2.y,
      orientation: 'vertical'
    },
    // Horizontal line (h1 → h2)
    {
      x1: h1.x,
      y1: h1.y,
      x2: h2.x,
      y2: h2.y,
      orientation: 'horizontal'
    }
  ];
  
  return {
    lines,
    connectionPoints: {
      v1,
      v2,
      h1,
      h2
    }
  };
}