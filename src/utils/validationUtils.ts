// Validation utilities for input pair constraints

// Define input pairs that need validation (first > second)
export const INPUT_PAIRS = [
  ['A1', 'A2'],
  ['B1', 'B2'],
  ['I1', 'I2'],
  ['E1', 'E2'],
  ['H1', 'H2'],
  ['J1', 'J2']
] as const;

// Validation error type
export interface ValidationError {
  pairId: string; // e.g., "A1-A2"
  message: string;
  firstInput: string;
  secondInput: string;
}

/**
 * Validate a single input pair
 * Returns null if valid, ValidationError if invalid
 * 
 * Rules:
 * - If either value is 0 (empty), no validation error
 * - First value must be strictly greater than second value
 * - Equal values are considered invalid
 */
export function validateInputPair(
  firstId: string,
  secondId: string,
  firstValue: number,
  secondValue: number
): ValidationError | null {
  // Skip validation if either input is empty (0)
  if (firstValue === 0 || secondValue === 0) {
    return null;
  }

  // Check if first value is greater than second value
  if (firstValue <= secondValue) {
    // Format the second value as currency for the error message
    const formattedValue = `$${secondValue.toFixed(2)}`;
    
    return {
      pairId: `${firstId}-${secondId}`,
      message: `Value must be smaller than ${formattedValue}`,
      firstInput: firstId,
      secondInput: secondId
    };
  }

  return null;
}

/**
 * Validate all input pairs
 * Returns array of validation errors (empty if all valid)
 */
export function validateAllInputPairs(
  inputValues: Record<string, number>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [firstId, secondId] of INPUT_PAIRS) {
    const firstValue = inputValues[firstId] || 0;
    const secondValue = inputValues[secondId] || 0;

    const error = validateInputPair(firstId, secondId, firstValue, secondValue);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/**
 * Get validation error for a specific pair
 * Returns null if no error exists for this pair
 */
export function getErrorForPair(
  errors: ValidationError[],
  firstId: string,
  secondId: string
): ValidationError | null {
  const pairId = `${firstId}-${secondId}`;
  return errors.find(error => error.pairId === pairId) || null;
}
