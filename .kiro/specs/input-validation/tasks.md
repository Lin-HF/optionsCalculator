# Implementation Plan: Input Validation

## Overview

This plan implements real-time validation for paired calculator inputs to ensure proper ordering constraints (first value < second value). The implementation adds validation utilities, updates the application state, and provides visual error feedback.

## Tasks

- [x] 1. Create validation utility module
  - Create `src/utils/validationUtils.ts` with validation functions
  - Define INPUT_PAIRS constant with all pairs to validate
  - Implement `validateInputPair` function
  - Implement `validateAllInputPairs` function
  - Implement `getErrorForPair` helper function
  - _Requirements: 1.1, 1.2_

- [ ]* 1.1 Write unit tests for validation utilities
  - Test `validateInputPair` with valid pairs (first < second)
  - Test `validateInputPair` with invalid pairs (first >= second)
  - Test `validateInputPair` with empty inputs (value = 0)
  - Test `validateInputPair` with negative values
  - Test `validateAllInputPairs` with multiple errors
  - Test `getErrorForPair` retrieval logic
  - _Requirements: 1.1, 1.2, 1.5_

- [ ]* 1.2 Write property test for validation logic
  - **Property 3: No error for valid pairs**
  - **Validates: Requirements 1.4, 1.5**
  - Generate random valid input pairs and verify no errors returned
  - _Requirements: 1.4, 1.5_

- [x] 2. Update type definitions
  - Add `ValidationError` interface to `src/types/index.ts`
  - Add `validationErrors` field to application state type
  - _Requirements: 1.3_

- [x] 3. Create ErrorDisplay component
  - Create `src/components/ErrorDisplay.tsx`
  - Create `src/components/ErrorDisplay.css`
  - Implement error message rendering with red styling
  - Position error message below input pair
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ]* 3.1 Write unit tests for ErrorDisplay component
  - Test error message rendering
  - Test positioning
  - Test styling
  - Test null error handling
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 4. Update UnifiedCalculator component
  - Add validation errors to component state
  - Call validation on input changes
  - Pass validation errors to ErrorDisplay components
  - Position ErrorDisplay components for each input pair
  - _Requirements: 1.1, 3.1, 3.2_

- [ ]* 4.1 Write property test for validation triggering
  - **Property 1: Validation triggers on input change**
  - **Validates: Requirements 3.1**
  - Generate random input changes and verify validation is called
  - _Requirements: 3.1_

- [ ]* 4.2 Write property test for error display
  - **Property 2: Error display for invalid pairs**
  - **Validates: Requirements 1.3, 2.1**
  - Generate random invalid pairs and verify errors are displayed
  - _Requirements: 1.3, 2.1_

- [ ] 5. Update App component
  - Add `validationErrors` to App state
  - Pass validation errors to UnifiedCalculator
  - Update state management to include validation
  - _Requirements: 1.1, 3.1_

- [ ]* 5.1 Write integration test for full validation flow
  - Test input change triggers validation
  - Test error display appears for invalid input
  - Test error removal when corrected
  - Test multiple simultaneous errors
  - _Requirements: 1.1, 1.3, 1.4, 3.1, 3.3_

- [ ]* 5.2 Write property test for independent validation
  - **Property 4: Independent pair validation**
  - **Validates: Requirements 2.4**
  - Generate random multi-pair scenarios and verify independence
  - _Requirements: 2.4_

- [ ]* 5.3 Write property test for error removal
  - **Property 5: Error removal on correction**
  - **Validates: Requirements 3.3**
  - Generate random error-correction scenarios and verify removal
  - _Requirements: 3.3_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
