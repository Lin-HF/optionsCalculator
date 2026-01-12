// Position utility functions for calculating border midpoints
// Implements Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6

/**
 * Interface representing the midpoint coordinates of all 4 borders of a rectangular element
 */
export interface BorderMidpoints {
  topMid: { x: number; y: number };
  bottomMid: { x: number; y: number };
  leftMid: { x: number; y: number };
  rightMid: { x: number; y: number };
}

/**
 * Calculate border midpoints for a rectangular element
 * @param x - Top-left corner x coordinate
 * @param y - Top-left corner y coordinate  
 * @param width - Element width
 * @param height - Element height
 * @returns BorderMidpoints object containing all 4 border midpoint coordinates
 */
export function calculateBorderMidpoints(
  x: number,
  y: number,
  width: number,
  height: number
): BorderMidpoints {
  return {
    topMid: { x: x + width / 2, y },
    bottomMid: { x: x + width / 2, y: y + height },
    leftMid: { x, y: y + height / 2 },
    rightMid: { x: x + width, y: y + height / 2 }
  };
}

/**
 * Interface for elements that have position properties
 */
export interface ElementWithPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  position: BorderMidpoints;
}

/**
 * Helper function to get input positions by ID from a layout
 * @param inputId - The input element ID
 * @param layout - The column layout containing input positions
 * @returns BorderMidpoints for the input element, or null if not found
 */
export function getInputPositions(inputId: string, layout: any): BorderMidpoints | null {
  const input = layout.inputs.find((inp: any) => inp.id === inputId);
  if (!input) {
    console.warn(`Input ${inputId} not found in layout`);
    return null;
  }
  
  // Use actual CSS dimensions for input elements (from PriceInput.css)
  // These match the actual rendered size: width: 140px, height: 48px
  const INPUT_WIDTH = 140;
  const INPUT_HEIGHT = 48;
  
  return calculateBorderMidpoints(input.x, input.y, INPUT_WIDTH, INPUT_HEIGHT);
}

/**
 * Helper function to get output positions by ID from a layout
 * @param outputId - The output element ID
 * @param layout - The column layout containing output positions
 * @returns BorderMidpoints for the output element, or null if not found
 */
export function getOutputPositions(outputId: string, layout: any): BorderMidpoints | null {
  const output = layout.outputs.find((out: any) => out.id === outputId);
  if (!output) {
    console.warn(`Output ${outputId} not found in layout`);
    return null;
  }
  
  // Use standard dimensions for output elements
  const OUTPUT_WIDTH = 120;
  const OUTPUT_HEIGHT = 50;
  
  return calculateBorderMidpoints(output.x, output.y, OUTPUT_WIDTH, OUTPUT_HEIGHT);
}