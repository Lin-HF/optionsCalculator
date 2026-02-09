# Requirements Document: Input Validation

## Introduction

This feature adds validation to ensure that paired input values maintain the correct ordering relationship (first value < second value) for all calculator input pairs.

## Glossary

- **Input_Pair**: Two related input fields where the first value must be less than the second value
- **Validation_Error**: A state where an input pair violates the ordering constraint
- **Error_Display**: Visual feedback shown to users when validation fails
- **System**: The price calculator application

## Requirements

### Requirement 1: Input Pair Validation

**User Story:** As a user, I want the system to validate that paired inputs maintain proper ordering, so that I can catch data entry errors immediately.

#### Acceptance Criteria

1. WHEN a user enters values in an input pair, THE System SHALL validate that the first value is less than the second value
2. THE System SHALL validate the following input pairs: A1 < A2, B1 < B2, I1 < I2, E1 < E2, H1 < H2, J1 < J2
3. WHEN validation fails for an input pair, THE System SHALL display an error message near the affected inputs
4. WHEN validation passes for an input pair, THE System SHALL remove any existing error messages for that pair
5. WHEN either input in a pair is empty (value = 0), THE System SHALL not show validation errors for that pair

### Requirement 2: Error Display

**User Story:** As a user, I want clear visual feedback when I enter invalid values, so that I can quickly identify and correct my mistakes.

#### Acceptance Criteria

1. WHEN a validation error occurs, THE System SHALL display a red error message below the input pair
2. THE Error_Display SHALL include text indicating which values are invalid
3. THE Error_Display SHALL be positioned clearly near the affected input fields
4. WHEN multiple input pairs have errors, THE System SHALL display separate error messages for each pair
5. THE Error_Display SHALL use consistent styling across all input pairs

### Requirement 3: Real-time Validation

**User Story:** As a user, I want validation to occur as I type, so that I receive immediate feedback on my input.

#### Acceptance Criteria

1. WHEN a user changes any input value, THE System SHALL immediately re-validate the affected input pair
2. THE System SHALL update error displays within 100ms of input change
3. WHEN a user corrects an invalid value, THE System SHALL immediately remove the error message
4. THE System SHALL validate on both input change and blur events
