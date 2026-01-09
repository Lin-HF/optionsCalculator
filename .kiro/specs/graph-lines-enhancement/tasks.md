# Implementation Plan: Graph Lines Enhancement

## Overview

This implementation plan converts the graph lines enhancement design into a series of incremental coding tasks. The approach follows the user's specified plan: preserve current positions, remove old lines, implement arrowLines first, then Llines, with functional testing focus throughout.

## Tasks

- [ ] 1. Create border midpoint position system
- Create utility functions for calculating border midpoints from element dimensions
- Add position getter properties to input/output elements
- _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ]* 1.1 Write property tests for border midpoint calculations
  - **Property 1: Border midpoint mathematical correctness**
  - **Property 2: Position object completeness**
  - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**

- [ ] 2. Implement arrowLines function
- [ ] 2.1 Create arrowLines function with TypeScript interfaces
  - Write function that generates 4 line segments (3 horizontal, 1 vertical)
  - Implement connection logic: a1→a2, b1→b2, c1→c2, d1→d2 with proper connectivity
  - Calculate horizontal line lengths as 1/2 x-distance between inputs and output
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ]* 2.2 Write property tests for arrowLines function
  - **Property 3: ArrowLines segment count**
  - **Property 4: ArrowLines orientation correctness**
  - **Property 5: ArrowLines horizontal length consistency**
  - **Property 6: ArrowLines connectivity**
  - **Property 7: ArrowLines endpoint validity**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [ ]* 2.3 Write unit tests for arrowLines function
  - Test specific calculator positions (A1, A2 → A3)
  - Test edge cases and error conditions
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 3. Remove existing line drawing system
- Remove all generateConnectionLines logic from CalculatorColumn.tsx
- Remove special case handling for C2, F2, D2, and G2 connections
- Preserve all input/output positioning exactly as configured
- _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 3.1 Write preservation tests
  - **Property 13: Position preservation**
  - **Property 14: Calculation preservation**
  - **Property 15: LocalStorage preservation**
  - **Validates: Requirements 4.2, 4.4, 8.1, 8.2, 8.3**

- [ ] 4. Apply arrowLines to multi-input calculations
- [ ] 4.1 Integrate arrowLines for calculation A (A1,A2 → A3)
  - Replace existing line logic with arrowLines function call
  - Use border midpoint positions from input/output elements
  - _Requirements: 5.1_

- [ ] 4.2 Integrate arrowLines for calculation B (B1,B2 → B3)
  - Apply arrowLines function to middle column calculation
  - _Requirements: 5.2_

- [ ] 4.3 Integrate arrowLines for calculation E (E1,E2 → E3)
  - Apply arrowLines function to left column bottom calculation
  - _Requirements: 5.3_

- [ ] 4.4 Integrate arrowLines for calculation H (H1,H2 → H3)
  - Apply arrowLines function to middle column bottom calculation
  - _Requirements: 5.4_

- [ ] 4.5 Integrate arrowLines for calculations I and J (I1,I2 → I3, J1,J2 → J3)
  - Apply arrowLines function to right column calculations
  - _Requirements: 5.5, 5.6_

- [ ] 5. Checkpoint - Test arrowLines implementation
- Ensure all arrowLines are rendering correctly
- Verify calculations and localStorage functionality remain unchanged
- Ask user for feedback and adjustments

- [ ] 6. Implement Llines function
- [ ] 6.1 Create Llines function with rotation support
  - Write function that generates 2 line segments (1 vertical, 1 horizontal)
  - Implement rotation logic for bottomLeftCorner, bottomRightCorner, topLeftCorner, topRightCorner
  - Ensure v2 connects to h1 at corner point
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ]* 6.2 Write property tests for Llines function
  - **Property 8: Llines segment count**
  - **Property 9: Llines orientation correctness**
  - **Property 10: Llines connectivity**
  - **Property 11: Llines rotation correctness**
  - **Property 12: Llines border midpoint selection**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

- [ ]* 6.3 Write unit tests for Llines function
  - Test each rotation type with known coordinates
  - Test error handling with invalid rotation parameters
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 7. Apply Llines to cross-input calculations
- [ ] 7.1 Integrate Llines for connection A2,C1 → C2
  - Replace existing line logic with Llines function call
  - Determine appropriate rotation based on element positions
  - _Requirements: 6.1_

- [ ] 7.2 Integrate Llines for connection D1,B2 → D2
  - Apply Llines function to middle column cross-connection
  - _Requirements: 6.2_

- [ ] 7.3 Integrate Llines for connection E1,F1 → F2
  - Apply Llines function to left column cross-connection
  - _Requirements: 6.3_

- [ ] 7.4 Integrate Llines for connection G1,H1 → G2
  - Apply Llines function to middle column cross-connection
  - _Requirements: 6.4_

- [ ] 8. Final integration and testing
- [ ] 8.1 Verify all line connections are working correctly
  - Test all calculator groups with new line system
  - Ensure visual consistency across all columns
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4_

- [ ]* 8.2 Run comprehensive functional tests
  - Execute all property-based tests
  - Run unit tests for edge cases
  - Verify calculation accuracy and localStorage functionality
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Final checkpoint - Complete system verification
- Ensure all tests pass and functionality is preserved
- Ask user if any adjustments are needed

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- Focus on functional testing rather than visual appearance testing
- All existing calculation logic and localStorage functionality must be preserved