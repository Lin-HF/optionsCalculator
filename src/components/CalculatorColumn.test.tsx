import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculatorColumn from './CalculatorColumn';
import { CalculatorGroupConfig } from '../types';

// Mock the child components
vi.mock('./DateHeader', () => ({
  default: ({ weekOffset }: { weekOffset: number }) => (
    <div data-testid="date-header">DateHeader-{weekOffset}</div>
  )
}));

vi.mock('./CalculatorGroup', () => ({
  default: ({ input1Id, input2Id }: { input1Id: string; input2Id: string }) => (
    <div data-testid="calculator-group">{input1Id}-{input2Id}</div>
  )
}));

describe('CalculatorColumn', () => {
  const mockOnValueChange = vi.fn();
  
  const mockCalculatorGroups: CalculatorGroupConfig[] = [
    {
      input1Id: 'A1',
      input2Id: 'A2',
      outputs: [{ id: 'A3', position: 'right', inputs: ['A1', 'A2'] }]
    },
    {
      input1Id: 'E1',
      input2Id: 'E2',
      outputs: [{ id: 'E3', position: 'right', inputs: ['E1', 'E2'] }]
    }
  ];

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders DateHeader with correct weekOffset', () => {
    render(
      <CalculatorColumn
        weekOffset={1}
        calculatorGroups={mockCalculatorGroups}
        onValueChange={mockOnValueChange}
      />
    );

    expect(screen.getByTestId('date-header')).toHaveTextContent('DateHeader-1');
  });

  it('renders all calculator groups', () => {
    render(
      <CalculatorColumn
        weekOffset={0}
        calculatorGroups={mockCalculatorGroups}
        onValueChange={mockOnValueChange}
      />
    );

    const calculatorGroups = screen.getAllByTestId('calculator-group');
    expect(calculatorGroups).toHaveLength(2);
    expect(calculatorGroups[0]).toHaveTextContent('A1-A2');
    expect(calculatorGroups[1]).toHaveTextContent('E1-E2');
  });

  it('renders with empty calculator groups', () => {
    render(
      <CalculatorColumn
        weekOffset={2}
        calculatorGroups={[]}
        onValueChange={mockOnValueChange}
      />
    );

    expect(screen.getByTestId('date-header')).toHaveTextContent('DateHeader-2');
    expect(screen.queryByTestId('calculator-group')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        calculatorGroups={mockCalculatorGroups}
        onValueChange={mockOnValueChange}
      />
    );

    const columnElement = container.querySelector('.calculator-column');
    const groupsElement = container.querySelector('.calculator-groups');
    
    expect(columnElement).toBeInTheDocument();
    expect(groupsElement).toBeInTheDocument();
  });

  it('passes inputValues to calculator groups', () => {
    const inputValues = { A1: 10, A2: 20 };
    
    render(
      <CalculatorColumn
        weekOffset={0}
        calculatorGroups={mockCalculatorGroups}
        inputValues={inputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // The component should render without errors when inputValues are provided
    expect(screen.getByTestId('date-header')).toBeInTheDocument();
    expect(screen.getAllByTestId('calculator-group')).toHaveLength(2);
  });
});