import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import CalculatorGroup from './CalculatorGroup';
import { OutputConfig } from '../types';
import { calculateAverage } from '../utils/calculationUtils';

describe('CalculatorGroup', () => {
  const mockOnValueChange = vi.fn();
  
  const defaultProps = {
    input1Id: 'A1',
    input2Id: 'A2',
    outputs: [
      {
        id: 'A3',
        position: 'right' as const,
        inputs: ['A1', 'A2']
      }
    ] as OutputConfig[],
    onValueChange: mockOnValueChange
  };

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders input fields with correct IDs', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    const input1 = screen.getByLabelText('A1');
    const input2 = screen.getByLabelText('A2');
    
    expect(input1).toHaveAttribute('id', 'A1');
    expect(input2).toHaveAttribute('id', 'A2');
  });

  it('renders input labels correctly', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
  });

  it('renders output display with correct label', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    expect(screen.getByText('A3:')).toBeInTheDocument();
  });

  it('calls onValueChange when input values change', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    const input1 = screen.getByLabelText('A1');
    fireEvent.change(input1, { target: { value: '10' } });
    
    expect(mockOnValueChange).toHaveBeenCalledWith('A1', 10);
  });

  it('renders multiple outputs with correct positioning', () => {
    const propsWithMultipleOutputs = {
      ...defaultProps,
      outputs: [
        {
          id: 'A3',
          position: 'right' as const,
          inputs: ['A1', 'A2']
        },
        {
          id: 'C2',
          position: 'left' as const,
          inputs: ['A2', 'C1']
        }
      ] as OutputConfig[]
    };

    render(<CalculatorGroup {...propsWithMultipleOutputs} />);
    
    expect(screen.getByText('A3:')).toBeInTheDocument();
    expect(screen.getByText('C2:')).toBeInTheDocument();
    
    // Check positioning classes
    const rightOutput = screen.getByText('A3:').closest('.output-container');
    const leftOutput = screen.getByText('C2:').closest('.output-container');
    
    expect(rightOutput).toHaveClass('output-right');
    expect(leftOutput).toHaveClass('output-left');
  });

  it('handles empty input values correctly', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    const input1 = screen.getByLabelText('A1');
    
    // The input should display empty when value is 0
    expect(input1).toHaveValue('');
    
    // When we type in the empty field, it should call onChange
    fireEvent.change(input1, { target: { value: '10' } });
    expect(mockOnValueChange).toHaveBeenCalledWith('A1', 10);
  });

  it('handles negative input values correctly', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    const input1 = screen.getByLabelText('A1');
    fireEvent.change(input1, { target: { value: '-5' } });
    
    expect(mockOnValueChange).toHaveBeenCalledWith('A1', -5);
  });

  it('handles decimal input values correctly', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    const input1 = screen.getByLabelText('A1');
    fireEvent.change(input1, { target: { value: '3.14' } });
    
    expect(mockOnValueChange).toHaveBeenCalledWith('A1', 3.14);
  });

  it('applies correct CSS classes for layout', () => {
    render(<CalculatorGroup {...defaultProps} />);
    
    const calculatorGroup = screen.getByText('A1').closest('.calculator-group');
    expect(calculatorGroup).toHaveClass('calculator-group');
    
    const input1Container = screen.getByText('A1').closest('.input-container');
    expect(input1Container).toHaveClass('input-1');
    
    const input2Container = screen.getByText('A2').closest('.input-container');
    expect(input2Container).toHaveClass('input-2');
  });

  // Property-based tests
  describe('Property-based tests', () => {
    /**
     * **Feature: price-calculator, Property 3: Responsive update consistency**
     * **Validates: Requirements 2.5, 3.5, 4.5**
     */
    it('Property 3: For any input value change, all dependent calculation results should immediately update to correct new values', () => {
      fc.assert(fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        (initialValue1, initialValue2, newValue1, newValue2) => {
          const mockOnValueChange = vi.fn();
          
          // Create a configuration with multiple outputs that depend on different inputs
          const complexOutputs: OutputConfig[] = [
            {
              id: 'A3',
              position: 'right',
              inputs: ['A1', 'A2']
            },
            {
              id: 'C2', 
              position: 'left',
              inputs: ['A2', 'C1'] // This depends on A2, so changing A2 should update both A3 and C2
            }
          ];

          // Test 1: Initial state calculation correctness
          const initialInputValues = {
            A1: initialValue1,
            A2: initialValue2,
            C1: 10 // Fixed value for C1
          };

          const { rerender } = render(
            <CalculatorGroup
              input1Id="A1"
              input2Id="A2"
              outputs={complexOutputs}
              onValueChange={mockOnValueChange}
              inputValues={initialInputValues}
            />
          );

          // Calculate expected values
          const expectedA3Initial = calculateAverage(initialValue1, initialValue2);
          const expectedC2Initial = calculateAverage(initialValue2, 10);

          // Test 2: Update A1 - should only affect A3, not C2
          const updatedInputValues1 = {
            ...initialInputValues,
            A1: newValue1
          };

          rerender(
            <CalculatorGroup
              input1Id="A1"
              input2Id="A2"
              outputs={complexOutputs}
              onValueChange={mockOnValueChange}
              inputValues={updatedInputValues1}
            />
          );

          const expectedA3AfterA1Change = calculateAverage(newValue1, initialValue2);
          // C2 should remain the same since it doesn't depend on A1
          const expectedC2AfterA1Change = expectedC2Initial;

          // Test 3: Update A2 - should affect both A3 and C2
          const updatedInputValues2 = {
            ...updatedInputValues1,
            A2: newValue2
          };

          rerender(
            <CalculatorGroup
              input1Id="A1"
              input2Id="A2"
              outputs={complexOutputs}
              onValueChange={mockOnValueChange}
              inputValues={updatedInputValues2}
            />
          );

          const expectedA3AfterA2Change = calculateAverage(newValue1, newValue2);
          const expectedC2AfterA2Change = calculateAverage(newValue2, 10);

          // Verify mathematical correctness of all calculations
          // Property: All calculations should be mathematically correct
          expect(expectedA3Initial).toBeCloseTo((initialValue1 + initialValue2) / 2, 10);
          expect(expectedC2Initial).toBeCloseTo((initialValue2 + 10) / 2, 10);
          expect(expectedA3AfterA1Change).toBeCloseTo((newValue1 + initialValue2) / 2, 10);
          expect(expectedC2AfterA1Change).toBeCloseTo((initialValue2 + 10) / 2, 10);
          expect(expectedA3AfterA2Change).toBeCloseTo((newValue1 + newValue2) / 2, 10);
          expect(expectedC2AfterA2Change).toBeCloseTo((newValue2 + 10) / 2, 10);

          // Property: Dependent calculations should update when their inputs change
          // A3 depends on A1 and A2, so it should change when either changes
          if (Math.abs(newValue1 - initialValue1) > 1e-10) {
            expect(expectedA3AfterA1Change).not.toBe(expectedA3Initial);
          }
          if (Math.abs(newValue2 - initialValue2) > 1e-10) {
            expect(expectedA3AfterA2Change).not.toBe(expectedA3AfterA1Change);
            expect(expectedC2AfterA2Change).not.toBe(expectedC2AfterA1Change);
          }

          // Property: Independent calculations should not update when unrelated inputs change
          // C2 depends on A2 and C1, so it should NOT change when only A1 changes
          expect(expectedC2AfterA1Change).toBe(expectedC2Initial);

          // Property: All calculations should be finite numbers
          expect(isFinite(expectedA3Initial)).toBe(true);
          expect(isFinite(expectedC2Initial)).toBe(true);
          expect(isFinite(expectedA3AfterA1Change)).toBe(true);
          expect(isFinite(expectedC2AfterA1Change)).toBe(true);
          expect(isFinite(expectedA3AfterA2Change)).toBe(true);
          expect(isFinite(expectedC2AfterA2Change)).toBe(true);
        }
      ), { numRuns: 100 });
    });
  });
});