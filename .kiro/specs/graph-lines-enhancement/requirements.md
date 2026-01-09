# Requirements Document

## Introduction

This specification defines the enhancement of the graph lines functionality in the price calculator application. The current system uses complex line routing with special cases for different input-output combinations. The new system will use two standardized line drawing functions: `arrowLines` for multi-input to single-output connections, and `Llines` for simple two-point connections.

## Glossary

- **ArrowLines**: A line drawing function that connects two inputs to one output using a standardized arrow pattern with 4 line segments (3 horizontal, 1 vertical)
- **Llines**: A line drawing function that connects two points using an L-shaped pattern with 2 line segments (1 horizontal, 1 vertical)
- **Input_Position**: An object containing the midpoint coordinates of all 4 borders of an input element (topMid, leftMid, rightMid, bottomMid)
- **Output_Position**: An object containing the midpoint coordinates of all 4 borders of an output element (topMid, leftMid, rightMid, bottomMid)
- **Connection_Lines**: SVG line elements that visually connect inputs to outputs
- **Rotation**: The orientation of L-shaped lines (bottomLeftCorner, bottomRightCorner, topLeftCorner, topRightCorner)
- **Border_Midpoints**: The calculated midpoint coordinates for each border of a rectangular element (top, left, right, bottom)

## Requirements

### Requirement 1: Border Midpoint Position System

**User Story:** As a developer, I want input and output elements to provide border midpoint coordinates, so that line connections can be precisely positioned at element edges.

#### Acceptance Criteria

1. WHEN an input or output element has dimensions (width, height) and position (x, y), THE System SHALL calculate 4 border midpoints
2. WHEN calculating topMid, THE System SHALL use coordinates (x + width/2, y)
3. WHEN calculating bottomMid, THE System SHALL use coordinates (x + width/2, y + height)
4. WHEN calculating leftMid, THE System SHALL use coordinates (x, y + height/2)
5. WHEN calculating rightMid, THE System SHALL use coordinates (x + width, y + height/2)
6. WHEN providing positions to line functions, THE System SHALL pass complete position objects containing all 4 midpoints

### Requirement 2: ArrowLines Function Implementation

**User Story:** As a developer, I want a standardized arrow line drawing function, so that I can consistently connect two inputs to one output across all calculator groups.

#### Acceptance Criteria

1. WHEN the arrowLines function is called with (input1Position, input2Position, outputPosition), THE System SHALL draw exactly 4 line segments
2. WHEN drawing arrow lines, THE System SHALL create 3 horizontal lines (a1a2, b1b2, c1c2) and 1 vertical line (d1d2)
3. WHEN calculating line positions, THE System SHALL set the length of all horizontal lines to 1/2 of the x-distance between inputs and output
4. WHEN connecting line segments, THE System SHALL ensure a2 connects to d1, b2 connects to d2, and the midpoint of d1d2 connects to c1
5. WHEN positioning endpoints, THE System SHALL place a1 at input1Position, b1 at input2Position, and c2 at outputPosition

### Requirement 2: ArrowLines Function Implementation

**User Story:** As a developer, I want a standardized arrow line drawing function, so that I can consistently connect two inputs to one output across all calculator groups.

#### Acceptance Criteria

1. WHEN the arrowLines function is called with (input1Position, input2Position, outputPosition), THE System SHALL draw exactly 4 line segments
2. WHEN drawing arrow lines, THE System SHALL create 3 horizontal lines (a1a2, b1b2, c1c2) and 1 vertical line (d1d2)
3. WHEN calculating line positions, THE System SHALL set the length of all horizontal lines to 1/2 of the x-distance between inputs and output
4. WHEN connecting line segments, THE System SHALL ensure a2 connects to d1, b2 connects to d2, and the midpoint of d1d2 connects to c1
5. WHEN positioning endpoints, THE System SHALL use appropriate border midpoints from input1Position, input2Position, and outputPosition
6. WHEN selecting connection points, THE System SHALL choose the most logical border midpoints based on relative positions (e.g., rightMid for inputs on the left, leftMid for outputs on the right)

### Requirement 3: Llines Function Implementation

**User Story:** As a developer, I want a flexible L-shaped line drawing function, so that I can connect any two points with proper orientation control.

#### Acceptance Criteria

1. WHEN the Llines function is called with (input1Position, input2Position, rotation), THE System SHALL draw exactly 2 line segments
2. WHEN drawing L-lines, THE System SHALL create 1 vertical line (v1v2) and 1 horizontal line (h1h2)
3. WHEN connecting segments, THE System SHALL ensure v2 connects to h1 at the corner point
4. WHEN rotation is "bottomLeftCorner", THE System SHALL position v1 at input1Position and h2 at input2Position
5. WHEN rotation is "bottomRightCorner", THE System SHALL adjust line orientations to form a bottom-right corner shape
6. WHEN rotation is "topLeftCorner", THE System SHALL adjust line orientations to form a top-left corner shape
7. WHEN rotation is "topRightCorner", THE System SHALL adjust line orientations to form a top-right corner shape

### Requirement 3: Llines Function Implementation

**User Story:** As a developer, I want a flexible L-shaped line drawing function, so that I can connect any two points with proper orientation control.

#### Acceptance Criteria

1. WHEN the Llines function is called with (input1Position, input2Position, rotation), THE System SHALL draw exactly 2 line segments
2. WHEN drawing L-lines, THE System SHALL create 1 vertical line (v1v2) and 1 horizontal line (h1h2)
3. WHEN connecting segments, THE System SHALL ensure v2 connects to h1 at the corner point
4. WHEN rotation is "bottomLeftCorner", THE System SHALL use appropriate border midpoints to form a bottom-left corner shape
5. WHEN rotation is "bottomRightCorner", THE System SHALL use appropriate border midpoints to form a bottom-right corner shape
6. WHEN rotation is "topLeftCorner", THE System SHALL use appropriate border midpoints to form a top-left corner shape
7. WHEN rotation is "topRightCorner", THE System SHALL use appropriate border midpoints to form a top-right corner shape
8. WHEN selecting connection points, THE System SHALL automatically choose the most appropriate border midpoints based on the rotation parameter

### Requirement 4: Current Line System Removal

**User Story:** As a developer, I want to remove the existing complex line drawing logic, so that the codebase is simplified and maintainable.

#### Acceptance Criteria

1. WHEN implementing the new line functions, THE System SHALL remove all existing generateConnectionLines logic
2. WHEN removing old lines, THE System SHALL preserve all input and output positioning exactly as currently configured
3. WHEN cleaning up code, THE System SHALL remove all special case handling for C2, F2, D2, and G2 connections
4. WHEN removing legacy code, THE System SHALL maintain all calculation functionality and localStorage operations

### Requirement 4: Current Line System Removal

**User Story:** As a developer, I want to remove the existing complex line drawing logic, so that the codebase is simplified and maintainable.

#### Acceptance Criteria

1. WHEN implementing the new line functions, THE System SHALL remove all existing generateConnectionLines logic
2. WHEN removing old lines, THE System SHALL preserve all input and output positioning exactly as currently configured
3. WHEN cleaning up code, THE System SHALL remove all special case handling for C2, F2, D2, and G2 connections
4. WHEN removing legacy code, THE System SHALL maintain all calculation functionality and localStorage operations

### Requirement 5: ArrowLines Application

**User Story:** As a user, I want consistent arrow-style connections for multi-input calculations, so that I can easily understand the data flow.

#### Acceptance Criteria

1. WHEN displaying calculation A (A1,A2 to A3), THE System SHALL use arrowLines function
2. WHEN displaying calculation B (B1,B2 to B3), THE System SHALL use arrowLines function  
3. WHEN displaying calculation E (E1,E2 to E3), THE System SHALL use arrowLines function
4. WHEN displaying calculation H (H1,H2 to H3), THE System SHALL use arrowLines function
5. WHEN displaying calculation I (I1,I2 to I3), THE System SHALL use arrowLines function
6. WHEN displaying calculation J (J1,J2 to J3), THE System SHALL use arrowLines function

### Requirement 5: ArrowLines Application

**User Story:** As a user, I want consistent arrow-style connections for multi-input calculations, so that I can easily understand the data flow.

#### Acceptance Criteria

1. WHEN displaying calculation A (A1,A2 to A3), THE System SHALL use arrowLines function
2. WHEN displaying calculation B (B1,B2 to B3), THE System SHALL use arrowLines function  
3. WHEN displaying calculation E (E1,E2 to E3), THE System SHALL use arrowLines function
4. WHEN displaying calculation H (H1,H2 to H3), THE System SHALL use arrowLines function
5. WHEN displaying calculation I (I1,I2 to I3), THE System SHALL use arrowLines function
6. WHEN displaying calculation J (J1,J2 to J3), THE System SHALL use arrowLines function

### Requirement 6: Llines Application

**User Story:** As a user, I want L-shaped connections for cross-input calculations, so that the connection paths are clear and unambiguous.

#### Acceptance Criteria

1. WHEN displaying connection A2,C1 to C2, THE System SHALL use Llines function with appropriate rotation
2. WHEN displaying connection D1,B2 to D2, THE System SHALL use Llines function with appropriate rotation
3. WHEN displaying connection E1,F1 to F2, THE System SHALL use Llines function with appropriate rotation
4. WHEN displaying connection G1,H1 to G2, THE System SHALL use Llines function with appropriate rotation

### Requirement 6: Llines Application

**User Story:** As a user, I want L-shaped connections for cross-input calculations, so that the connection paths are clear and unambiguous.

#### Acceptance Criteria

1. WHEN displaying connection A2,C1 to C2, THE System SHALL use Llines function with appropriate rotation
2. WHEN displaying connection D1,B2 to D2, THE System SHALL use Llines function with appropriate rotation
3. WHEN displaying connection E1,F1 to F2, THE System SHALL use Llines function with appropriate rotation
4. WHEN displaying connection G1,H1 to G2, THE System SHALL use Llines function with appropriate rotation

### Requirement 7: Functional Testing Focus

**User Story:** As a developer, I want comprehensive functional testing without UI visual testing, so that I can verify the line drawing logic works correctly.

#### Acceptance Criteria

1. WHEN testing line functions, THE System SHALL verify correct line segment generation
2. WHEN testing positioning, THE System SHALL validate that endpoints match expected coordinates
3. WHEN running tests, THE System SHALL focus on mathematical calculations rather than visual appearance
4. WHEN testing rotations, THE System SHALL verify that L-line orientations produce correct corner shapes

### Requirement 7: Functional Testing Focus

**User Story:** As a developer, I want comprehensive functional testing without UI visual testing, so that I can verify the line drawing logic works correctly.

#### Acceptance Criteria

1. WHEN testing line functions, THE System SHALL verify correct line segment generation
2. WHEN testing positioning, THE System SHALL validate that endpoints match expected coordinates
3. WHEN running tests, THE System SHALL focus on mathematical calculations rather than visual appearance
4. WHEN testing rotations, THE System SHALL verify that L-line orientations produce correct corner shapes
5. WHEN testing border midpoints, THE System SHALL validate that calculated coordinates are mathematically correct

### Requirement 8: Calculation Preservation

**User Story:** As a user, I want all existing calculator functionality to remain unchanged, so that my calculations and saved data continue to work.

#### Acceptance Criteria

1. WHEN implementing new line functions, THE System SHALL preserve all calculation logic exactly as before
2. WHEN updating the UI, THE System SHALL maintain all localStorage functionality for data persistence
3. WHEN changing line rendering, THE System SHALL keep all input and output positioning unchanged
4. WHEN testing the system, THE System SHALL verify that all mathematical operations produce identical results