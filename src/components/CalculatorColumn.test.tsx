import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculatorColumn from './CalculatorColumn';

// Mock the child components
vi.mock('./DateHeader', () => ({
  default: ({ weekOffset }: { weekOffset: number }) => (
    <div data-testid="date-header">DateHeader-{weekOffset}</div>
  )
}));

vi.mock('./PriceInput', () => ({
  default: ({ id, value, onChange, color }: { id: string; value: number; onChange: (value: number) => void; color?: string }) => (
    <input data-testid={`price-input-${id}`} data-color={color} value={value} onChange={(e) => onChange(Number(e.target.value))} />
  )
}));

vi.mock('./AverageDisplay', () => ({
  default: ({ value }: { value: number }) => (
    <div data-testid={`average-display`} className="average-display-container">
      <div className="average-value">${value}</div>
    </div>
  )
}));

describe('CalculatorColumn', () => {
  const mockOnValueChange = vi.fn();
  const mockInputValues = {
    A1: 10, A2: 20, C1: 30, E1: 40, E2: 50, F1: 60,
    B1: 70, B2: 80, D1: 90, G1: 100, H1: 110, H2: 120,
    I1: 130, I2: 140, J1: 150, J2: 160
  };

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders DateHeader with correct weekOffset', () => {
    render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    expect(screen.getByTestId('date-header')).toHaveTextContent('DateHeader-1');
  });

  it('renders inputs and outputs for left column', () => {
    render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that inputs are rendered
    expect(screen.getByTestId('price-input-A1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-A2')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-C1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-E1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-E2')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-F1')).toBeInTheDocument();

    // Check that outputs are rendered (by checking for average display components)
    const averageDisplays = screen.getAllByTestId('average-display');
    expect(averageDisplays).toHaveLength(4); // A3, C2, E3, F2
  });

  it('renders inputs and outputs for middle column', () => {
    render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that inputs are rendered
    expect(screen.getByTestId('price-input-B1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-B2')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-D1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-G1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-H1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-H2')).toBeInTheDocument();

    // Check that outputs are rendered (by checking for average display components)
    const averageDisplays = screen.getAllByTestId('average-display');
    expect(averageDisplays).toHaveLength(4); // B3, D2, G2, H3
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    const columnElement = container.querySelector('.calculator-column');
    const areaElement = container.querySelector('.calculator-area');
    
    expect(columnElement).toBeInTheDocument();
    expect(areaElement).toBeInTheDocument();
  });

  it('handles invalid column index gracefully', () => {
    render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={999}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Should still render DateHeader
    expect(screen.getByTestId('date-header')).toBeInTheDocument();
    
    // Should not crash and should render empty calculator area
    const areaElement = document.querySelector('.calculator-area');
    expect(areaElement).toBeInTheDocument();
  });
});