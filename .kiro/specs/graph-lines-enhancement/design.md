# Design Document

## Overview

This design document outlines the implementation of a new graph lines system for the price calculator application. The current system uses complex, case-specific line routing logic that is difficult to maintain and extend. The new system introduces two standardized line drawing functions: `arrowLines` for multi-input to single-output connections, and `Llines` for two-point L-shaped connections.

The design focuses on mathematical precision, code simplicity, and visual consistency while preserving all existing functionality and positioning.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CalculatorColumn                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Input/Output  │  │  Position       │  │ Line Drawing │ │
│  │   Elements      │  │  Calculator     │  │  Functions   │ │
│  │                 │  │                 │  │              │ │
│  │ - PriceInput    │  │ - Border        │  │ - arrowLines │ │
│  │ - AverageDisplay│  │   Midpoints     │  │ - Llines     │ │
│  │                 │  │ - Position      │  │              │ │
│  │                 │  │   Objects       │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│           │                     │                    │      │
│           └─────────────────────┼────────────────────┘      │
│                                 │                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                SVG Connection Lines                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Relationships

1. **CalculatorColumn**: Main container that orchestrates line drawing
2. **Position Calculator**: Utility functions to calculate border midpoints
3. **Line Drawing Functions**: Pure functions that generate SVG line elements
4. **SVG Renderer**: Renders the generated line elements

## Components and Interfaces

### Position System

#### BorderMidpoints Interface
```typescript
interface BorderMidpoints {
  topMid: { x: number; y: number };
  bottomMid: { x: number; y: number };
  leftMid: { x: number; y: number };
  rightMid: { x: number; y: number };
}
```

#### Element Position Properties
Each input and output element should expose its border midpoints as accessible properties:

```typescript
// Example usage:
// A1.position.leftMid → { x: 10, y: 5 }
// A1.position.rightMid → { x: 120, y: 5 }
// A3.position.leftMid → { x: 300, y: 70 }

interface ElementWithPosition {
  id: string;
  position: BorderMidpoints;
  // ... other element properties
}

// Implementation in components:
class InputElement {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  
  get position(): BorderMidpoints {
    return calculateBorderMidpoints(this._x, this._y, this._width, this._height);
  }
}

class OutputElement {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  
  get position(): BorderMidpoints {
    return calculateBorderMidpoints(this._x, this._y, this._width, this._height);
  }
}
```

#### Position Calculator Functions
```typescript
function calculateBorderMidpoints(
  x: number, 
  y: number, 
  width: number, 
  height: number
): BorderMidpoints

// Helper functions to get element positions by ID
function getInputPositions(inputId: string, layout: ColumnLayout): BorderMidpoints
function getOutputPositions(outputId: string, layout: ColumnLayout): BorderMidpoints

// Usage examples:
// const a1Position = getInputPositions('A1', leftColumnLayout);
// const a3Position = getOutputPositions('A3', leftColumnLayout);
// arrowLines(a1Position, a2Position, a3Position);
```

### Line Drawing Functions

#### ArrowLines Function
```typescript
interface ArrowLinesResult {
  lines: SVGLineElement[];
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

function arrowLines(
  input1Position: BorderMidpoints,
  input2Position: BorderMidpoints,
  outputPosition: BorderMidpoints
): ArrowLinesResult
```

#### Llines Function
```typescript
type LlineRotation = 'bottomLeftCorner' | 'bottomRightCorner' | 'topLeftCorner' | 'topRightCorner';

interface LlinesResult {
  lines: SVGLineElement[];
  connectionPoints: {
    v1: { x: number; y: number };
    v2: { x: number; y: number };
    h1: { x: number; y: number };
    h2: { x: number; y: number };
  };
}

function Llines(
  input1Position: BorderMidpoints,
  input2Position: BorderMidpoints,
  rotation: LlineRotation
): LlinesResult
```

## Data Models

### Enhanced Layout Configuration
```typescript
// Updated input position with border midpoints
interface InputPosition {
  id: string;
  x: number; // Top-left corner x coordinate
  y: number; // Top-left corner y coordinate
  width: number; // Element width
  height: number; // Element height
  color: 'red' | 'green';
  label?: string;
  
  // Computed border midpoints (getter properties)
  get position(): BorderMidpoints;
}

// Updated output position with border midpoints
interface OutputPosition {
  id: string;
  x: number; // Top-left corner x coordinate
  y: number; // Top-left corner y coordinate
  width: number; // Element width
  height: number; // Element height
  inputs: string[];
  position: 'left' | 'right' | 'top' | 'bottom';
  
  // Computed border midpoints (getter properties)
  get position(): BorderMidpoints;
}

// Example implementation:
class CalculatorInput implements InputPosition {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: 'red' | 'green',
    public label?: string
  ) {}
  
  get position(): BorderMidpoints {
    return calculateBorderMidpoints(this.x, this.y, this.width, this.height);
  }
}

// Usage example:
// const a1 = new CalculatorInput('A1', 25, 25, 110, 80, 'green');
// const leftMid = a1.position.leftMid; // { x: 25, y: 65 }
// const rightMid = a1.position.rightMid; // { x: 135, y: 65 }
```

### Line Configuration
```typescript
interface LineConfig {
  strokeColor: string;
  strokeWidth: number;
  arrowMarker?: string;
}

interface ConnectionMapping {
  type: 'arrow' | 'L';
  inputs: string[];
  output: string;
  rotation?: LlineRotation; // Only for L-type connections
}
```

### Element Dimensions
```typescript
interface ElementDimensions {
  input: {
    width: number;
    height: number;
  };
  output: {
    width: number;
    height: number;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Border Midpoint Calculation Properties

Property 1: Border midpoint mathematical correctness
*For any* element with position (x, y) and dimensions (width, height), the calculated border midpoints should satisfy the mathematical formulas: topMid = (x + width/2, y), bottomMid = (x + width/2, y + height), leftMid = (x, y + height/2), rightMid = (x + width, y + height/2)
**Validates: Requirements 1.2, 1.3, 1.4, 1.5**

Property 2: Position object completeness
*For any* position object passed to line functions, it should contain all four required border midpoint properties (topMid, bottomMid, leftMid, rightMid)
**Validates: Requirements 1.6**

### ArrowLines Function Properties

Property 3: ArrowLines segment count
*For any* valid input positions, the arrowLines function should return exactly 4 line segments
**Validates: Requirements 2.1**

Property 4: ArrowLines orientation correctness
*For any* arrowLines result, there should be exactly 3 horizontal lines and 1 vertical line
**Validates: Requirements 2.2**

Property 5: ArrowLines horizontal length consistency
*For any* arrowLines result, all horizontal line segments should have the same length equal to 1/2 of the x-distance between inputs and output
**Validates: Requirements 2.3**

Property 6: ArrowLines connectivity
*For any* arrowLines result, the connection points should satisfy: a2 connects to d1, b2 connects to d2, and the midpoint of d1d2 connects to c1
**Validates: Requirements 2.4**

Property 7: ArrowLines endpoint validity
*For any* arrowLines result, all line endpoints should correspond to actual border midpoints from the input position objects
**Validates: Requirements 2.5**

### Llines Function Properties

Property 8: Llines segment count
*For any* valid input positions and rotation, the Llines function should return exactly 2 line segments
**Validates: Requirements 3.1**

Property 9: Llines orientation correctness
*For any* Llines result, there should be exactly 1 vertical line and 1 horizontal line
**Validates: Requirements 3.2**

Property 10: Llines connectivity
*For any* Llines result, the endpoint of the vertical line should match the start point of the horizontal line
**Validates: Requirements 3.3**

Property 11: Llines rotation correctness
*For any* Llines result with a specific rotation parameter, the relative positions of the lines should form the correct corner shape (bottomLeft, bottomRight, topLeft, or topRight)
**Validates: Requirements 3.4, 3.5, 3.6, 3.7**

Property 12: Llines border midpoint selection
*For any* Llines call with a rotation parameter, the function should automatically select the most appropriate border midpoints to achieve the desired corner shape
**Validates: Requirements 3.8**

### System Preservation Properties

Property 13: Position preservation
*For any* input or output element, its position should remain exactly the same before and after implementing the new line system
**Validates: Requirements 4.2, 8.3**

Property 14: Calculation preservation
*For any* set of input values, the calculated output values should be identical before and after implementing the new line system
**Validates: Requirements 4.4, 8.1**

Property 15: LocalStorage preservation
*For any* data saved to localStorage, it should be saved and loaded correctly before and after implementing the new line system
**Validates: Requirements 8.2**

<function_calls>
<invoke name="prework">
<parameter name="featureName">graph-lines-enhancement

## Error Handling

### Input Validation
- **Invalid Dimensions**: Functions should handle zero or negative width/height gracefully
- **Missing Position Data**: Functions should validate that all required border midpoints exist
- **Invalid Rotation**: Llines function should validate rotation parameter against allowed values

### Fallback Behavior
- **Calculation Errors**: If line calculation fails, render a simple direct line between elements
- **Missing Elements**: If input/output elements are not found, skip line rendering for that connection
- **SVG Rendering Issues**: Provide console warnings for debugging while maintaining application stability

### Error Recovery
```typescript
interface LineDrawingError {
  type: 'validation' | 'calculation' | 'rendering';
  message: string;
  fallbackApplied: boolean;
}

function handleLineDrawingError(error: LineDrawingError): void {
  console.warn(`Line drawing error: ${error.message}`);
  if (error.fallbackApplied) {
    console.info('Fallback line rendering applied');
  }
}
```

## Testing Strategy

### Dual Testing Approach
The testing strategy combines unit tests for specific examples and edge cases with property-based tests for comprehensive validation across all possible inputs.

**Unit Tests** focus on:
- Specific examples that demonstrate correct behavior
- Edge cases (zero dimensions, extreme positions)
- Integration between line functions and React components
- Regression tests for existing functionality

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs (Properties 1-15 above)
- Mathematical correctness across random input ranges
- Comprehensive input coverage through randomization

### Property-Based Testing Configuration
- **Testing Library**: Use `fast-check` for TypeScript property-based testing
- **Test Iterations**: Minimum 100 iterations per property test
- **Test Tagging**: Each property test references its design document property

Example property test structure:
```typescript
// Feature: graph-lines-enhancement, Property 1: Border midpoint mathematical correctness
test('border midpoint calculations are mathematically correct', () => {
  fc.assert(fc.property(
    fc.integer(0, 1000), // x
    fc.integer(0, 1000), // y  
    fc.integer(1, 500),  // width
    fc.integer(1, 500),  // height
    (x, y, width, height) => {
      const midpoints = calculateBorderMidpoints(x, y, width, height);
      
      expect(midpoints.topMid).toEqual({ x: x + width/2, y });
      expect(midpoints.bottomMid).toEqual({ x: x + width/2, y: y + height });
      expect(midpoints.leftMid).toEqual({ x, y: y + height/2 });
      expect(midpoints.rightMid).toEqual({ x: x + width, y: y + height/2 });
    }
  ), { numRuns: 100 });
});
```

### Unit Testing Examples
- Test arrowLines with specific calculator positions (A1, A2 → A3)
- Test Llines with each rotation type using known coordinates
- Test error handling with invalid inputs
- Test integration with existing CalculatorColumn component

### Testing Focus Areas
1. **Mathematical Accuracy**: Verify all coordinate calculations
2. **Function Contracts**: Ensure functions return expected data structures
3. **Integration Points**: Test interaction with React components and SVG rendering
4. **Backward Compatibility**: Verify existing functionality remains unchanged
5. **Performance**: Ensure line generation doesn't impact rendering performance

The testing approach ensures both correctness of individual functions and system-wide behavior while maintaining focus on functional validation rather than visual appearance testing.