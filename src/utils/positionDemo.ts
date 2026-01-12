// Demonstration of the border midpoint position system
// This file shows how to use the new position utilities

import { 
  calculateBorderMidpoints, 
  getInputPositions, 
  getOutputPositions 
} from './positionUtils';
import { 
  CalculatorInput, 
  CalculatorOutput,
  createEnhancedInputs,
  createEnhancedOutputs,
  LEFT_COLUMN_LAYOUT 
} from '../config/calculatorConfig';

// Example 1: Basic border midpoint calculation
console.log('=== Example 1: Basic Border Midpoint Calculation ===');
const elementPosition = calculateBorderMidpoints(100, 50, 200, 100);
console.log('Element at (100, 50) with size 200x100:');
console.log('  topMid:', elementPosition.topMid);      // { x: 200, y: 50 }
console.log('  bottomMid:', elementPosition.bottomMid); // { x: 200, y: 150 }
console.log('  leftMid:', elementPosition.leftMid);     // { x: 100, y: 100 }
console.log('  rightMid:', elementPosition.rightMid);   // { x: 300, y: 100 }

// Example 2: Getting positions from layout
console.log('\n=== Example 2: Getting Positions from Layout ===');
const a1Position = getInputPositions('A1', LEFT_COLUMN_LAYOUT);
const a3Position = getOutputPositions('A3', LEFT_COLUMN_LAYOUT);

if (a1Position && a3Position) {
  console.log('A1 input positions:');
  console.log('  rightMid:', a1Position.rightMid);   // Connection point for lines
  
  console.log('A3 output positions:');
  console.log('  leftMid:', a3Position.leftMid);     // Connection point for lines
}

// Example 3: Enhanced calculator elements with position properties
console.log('\n=== Example 3: Enhanced Calculator Elements ===');
const enhancedInputs = createEnhancedInputs(LEFT_COLUMN_LAYOUT);
const enhancedOutputs = createEnhancedOutputs(LEFT_COLUMN_LAYOUT);

// Find A1 input and A3 output
const a1Enhanced = enhancedInputs.find(input => input.id === 'A1');
const a3Enhanced = enhancedOutputs.find(output => output.id === 'A3');

if (a1Enhanced && a3Enhanced) {
  console.log('A1 enhanced input:');
  console.log('  position.rightMid:', a1Enhanced.position.rightMid);
  
  console.log('A3 enhanced output:');
  console.log('  borderMidpoints.leftMid:', a3Enhanced.borderMidpoints.leftMid);
}

// Example 4: Creating individual enhanced elements
console.log('\n=== Example 4: Creating Individual Enhanced Elements ===');
const customInput = new CalculatorInput('CUSTOM', 50, 75, 110, 80, 'green', 'TEST');
const customOutput = new CalculatorOutput('RESULT', 200, 100, 120, 50, ['CUSTOM'], 'right');

console.log('Custom input position properties:');
console.log('  topMid:', customInput.position.topMid);
console.log('  rightMid:', customInput.position.rightMid);

console.log('Custom output position properties:');
console.log('  leftMid:', customOutput.borderMidpoints.leftMid);
console.log('  topMid:', customOutput.borderMidpoints.topMid);

export { 
  calculateBorderMidpoints, 
  getInputPositions, 
  getOutputPositions,
  CalculatorInput,
  CalculatorOutput 
};