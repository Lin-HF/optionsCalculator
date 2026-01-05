import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculatorGroup from './CalculatorGroup';
import { OutputConfig } from '../types';

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
});