/**
 * Calculation utilities for the price calculator
 * Handles average calculations and number formatting
 */

/**
 * Calculate the average of two numbers
 * @param value1 - First number (empty inputs are treated as 0)
 * @param value2 - Second number (empty inputs are treated as 0)
 * @returns The arithmetic average of the two values
 */
export function calculateAverage(value1: number, value2: number): number {
  // Handle empty/undefined values as 0
  const num1 = value1 || 0;
  const num2 = value2 || 0;
  
  return (num1 + num2) / 2;
}

/**
 * Format a number for display with appropriate decimal places
 * @param value - Number to format
 * @param maxDecimals - Maximum number of decimal places (default: 2)
 * @returns Formatted number string with consistent decimal representation
 */
export function formatNumber(value: number, maxDecimals: number = 2): string {
  // Handle edge cases
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }
  
  // Round to specified decimal places to avoid floating point precision issues
  const rounded = Math.round(value * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  
  // Format with up to maxDecimals decimal places, removing trailing zeros
  return rounded.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

/**
 * Calculate and format average in one step
 * @param value1 - First number
 * @param value2 - Second number
 * @param maxDecimals - Maximum decimal places for formatting (default: 2)
 * @returns Formatted average string
 */
export function calculateAndFormatAverage(value1: number, value2: number, maxDecimals: number = 2): string {
  const average = calculateAverage(value1, value2);
  return formatNumber(average, maxDecimals);
}