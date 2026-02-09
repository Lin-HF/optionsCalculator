# Design Document: Input Validation

## Overview

This feature implements real-time validation for paired calculator inputs to ensure proper ordering (first value < second value). The validation provides immediate visual feedback to users when they enter invalid data.

## Architecture

The validation system follows a centralized validation approach:

1. **Validation Logic Layer**: Centralized validation functions that check input pair constraints
2. **State Management Layer**: Tracks validation errors in the application state
3. **UI Feedback Layer**: Components display error messages based on validation state

## Components and Interfaces

### Validation Utility

A new utility module `src/utils/validationUtils.ts` will provide:

```typescript
// Define input pairs that need validation
export const INPUT_PAIRS = [
  ['A1', 'A2'],
  ['B1', 'B2'],
  ['I1', 'I2'],
  ['E1', 'E2'],
  ['H1', 'H2'],
  ['J1', 'J2']
] as const;

// Validation result type
export interface ValidationError {
  pairId: string; // e.g., "A1-A2"
  message: string;
  firstInput: string;
  secondInput: string;
}

// Validate a single input pair
export function validateInputPair(
  firstId: string,
  secondId: string,
  firstValue: number,
  secondValue: number
): ValidationError | null;

// Validate all input pairs
export function validateAllInputPairs(
  inputValues: Record<string, number>
): ValidationError[];

// Get error for specific pair
export function getErrorForPair(
  errors: ValidationError[],
  firstId: string,
  secondId: string
): ValidationError | null;
```

### Type Extensions

Update `src/types/index.ts`:

```typescript
// Add validation error type
export interface ValidationError {
  pairId: string;
  message: string;
  firstInput: string;
  secondInput: string;
}

// Extend App state
export interface ExtendedAppState extends AppState {
  validationErrors: ValidationError[];
}
```

### Component Updates

#### UnifiedCalculator Component

- Add validation errors to state
- Pass validation errors to child components
- Trigger validation on input changes

#### New ErrorDisplay Component

Create `src/components/ErrorDisplay.tsx`:

```typescript
interface ErrorDisplayProps {
  error: ValidationError | null;
  position: { x: number; y: number };
}

// Displays error message at specified position
```

## Data Models

### Validation Error Model

```typescript
interface ValidationError {
  pairId: string;        // Unique identifier: "A1-A2"
  message: string;       // Error message to display
  firstInput: string;    // First input ID
  secondInput: string;   // Second input ID
}
```

### Input Pair Definition

```typescript
type InputPair = [string, string]; // [firstId, secondId]

const INPUT_PAIRS: InputPair[] = [
  ['A1', 'A2'],
  ['B1', 'B2'],
  ['I1', 'I2'],
  ['E1', 'E2'],
  ['H1', 'H2'],
  ['J1', 'J2']
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Validation triggers on input change

*For any* input pair and any value change to either input in that pair, the system should immediately re-validate the pair and update the validation error state accordingly.

**Validates: Requirements 3.1**

### Property 2: Error display for invalid pairs

*For any* input pair where the first value is greater than or equal to the second value (and both are non-zero), the system should display a validation error for that pair.

**Validates: Requirements 1.3, 2.1**

### Property 3: No error for valid pairs

*For any* input pair where the first value is less than the second value, or where either value is zero, the system should not display a validation error for that pair.

**Validates: Requirements 1.4, 1.5**

### Property 4: Independent pair validation

*For any* two different input pairs, a validation error in one pair should not affect the validation state of the other pair.

**Validates: Requirements 2.4**

### Property 5: Error removal on correction

*For any* input pair with a validation error, when the user corrects the values so that the first value is less than the second value, the error should be immediately removed.

**Validates: Requirements 3.3**

## Error Handling

### Validation Edge Cases

1. **Empty inputs**: When either input is 0 (empty), skip validation
2. **Equal values**: Treat equal values as invalid (first must be strictly less than second)
3. **Negative values**: Support negative numbers in validation
4. **NaN values**: Treat NaN as 0 for validation purposes

### Error Message Format

Standard error message: `"${firstId} must be less than ${secondId}"`

Example: "A1 must be less than A2"

## Testing Strategy

### Unit Tests

- Test `validateInputPair` with various value combinations
- Test `validateAllInputPairs` with multiple error scenarios
- Test `getErrorForPair` retrieval logic
- Test ErrorDisplay component rendering
- Test edge cases: empty inputs, equal values, negative values

### Property-Based Tests

Each property test should run a minimum of 100 iterations and reference its design document property using the tag format: **Feature: input-validation, Property {number}: {property_text}**

1. **Property 1 Test**: Generate random input changes and verify validation triggers
2. **Property 2 Test**: Generate random invalid pairs and verify errors appear
3. **Property 3 Test**: Generate random valid pairs and verify no errors
4. **Property 4 Test**: Generate random multi-pair scenarios and verify independence
5. **Property 5 Test**: Generate random error-correction scenarios and verify removal

### Integration Tests

- Test full validation flow from input change to error display
- Test multiple simultaneous validation errors
- Test error clearing when values are corrected
