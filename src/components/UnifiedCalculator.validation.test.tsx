import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UnifiedCalculator from './UnifiedCalculator';

describe('UnifiedCalculator - Validation Integration', () => {
  const mockOnValueChange = () => {};

  it('should display error when A1 <= A2', () => {
    const inputValues = {
      A1: 10,
      A2: 20,
      B1: 0, B2: 0,
      I1: 0, I2: 0,
      E1: 0, E2: 0,
      H1: 0, H2: 0,
      J1: 0, J2: 0,
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    const errorElement = screen.getByTestId('error-A1-A2');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Value must be smaller than $20.00');
  });

  it('should not display error when A1 > A2', () => {
    const inputValues = {
      A1: 20,
      A2: 10,
      B1: 0, B2: 0,
      I1: 0, I2: 0,
      E1: 0, E2: 0,
      H1: 0, H2: 0,
      J1: 0, J2: 0,
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    const errorElement = screen.queryByTestId('error-A1-A2');
    expect(errorElement).not.toBeInTheDocument();
  });

  it('should display multiple errors for multiple invalid pairs', () => {
    const inputValues = {
      A1: 10, A2: 20, // Invalid
      B1: 15, B2: 25, // Invalid
      I1: 5, I2: 10,  // Invalid
      E1: 0, E2: 0,   // Empty (no error)
      H1: 0, H2: 0,   // Empty (no error)
      J1: 0, J2: 0,   // Empty (no error)
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    expect(screen.getByTestId('error-A1-A2')).toBeInTheDocument();
    expect(screen.getByTestId('error-B1-B2')).toBeInTheDocument();
    expect(screen.getByTestId('error-I1-I2')).toBeInTheDocument();
  });

  it('should not display error when either value is 0 (empty)', () => {
    const inputValues = {
      A1: 0,  // Empty
      A2: 10,
      B1: 15,
      B2: 0,  // Empty
      I1: 0, I2: 0,
      E1: 0, E2: 0,
      H1: 0, H2: 0,
      J1: 0, J2: 0,
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    expect(screen.queryByTestId('error-A1-A2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-B1-B2')).not.toBeInTheDocument();
  });

  it('should validate all six input pairs', () => {
    const inputValues = {
      A1: 10, A2: 20, // Invalid
      B1: 15, B2: 25, // Invalid
      I1: 5, I2: 10,  // Invalid
      E1: 30, E2: 40, // Invalid
      H1: 12, H2: 18, // Invalid
      J1: 8, J2: 16,  // Invalid
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    // All six pairs should show errors
    expect(screen.getByTestId('error-A1-A2')).toBeInTheDocument();
    expect(screen.getByTestId('error-B1-B2')).toBeInTheDocument();
    expect(screen.getByTestId('error-I1-I2')).toBeInTheDocument();
    expect(screen.getByTestId('error-E1-E2')).toBeInTheDocument();
    expect(screen.getByTestId('error-H1-H2')).toBeInTheDocument();
    expect(screen.getByTestId('error-J1-J2')).toBeInTheDocument();
  });

  it('should handle negative values correctly', () => {
    const inputValues = {
      A1: -20,
      A2: -10, // Invalid: -20 < -10
      B1: -10,
      B2: -20, // Valid: -10 > -20
      I1: 0, I2: 0,
      E1: 0, E2: 0,
      H1: 0, H2: 0,
      J1: 0, J2: 0,
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    expect(screen.getByTestId('error-A1-A2')).toBeInTheDocument();
    expect(screen.queryByTestId('error-B1-B2')).not.toBeInTheDocument();
  });

  it('should show error when values are equal', () => {
    const inputValues = {
      A1: 15,
      A2: 15, // Invalid: equal values
      B1: 0, B2: 0,
      I1: 0, I2: 0,
      E1: 0, E2: 0,
      H1: 0, H2: 0,
      J1: 0, J2: 0,
      C1: 0, F1: 0, D1: 0, G1: 0
    };

    render(<UnifiedCalculator inputValues={inputValues} onValueChange={mockOnValueChange} />);
    
    expect(screen.getByTestId('error-A1-A2')).toBeInTheDocument();
  });
});
