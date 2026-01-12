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

  it('renders arrow lines for calculation A in left column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation A are rendered
    const calcALines = container.querySelectorAll('[data-testid^="calc-A-line-"]');
    expect(calcALines).toHaveLength(4); // Should have 4 line segments for arrowLines
  });

  it('does not render arrow lines for calculation A in non-left columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation A are NOT rendered in middle column
    const calcALines = container.querySelectorAll('[data-testid^="calc-A-line-"]');
    expect(calcALines).toHaveLength(0); // Should have no lines for calculation A
  });

  it('renders arrow lines for calculation B in middle column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation B are rendered
    const calcBLines = container.querySelectorAll('[data-testid^="calc-B-line-"]');
    expect(calcBLines).toHaveLength(4); // Should have 4 line segments for arrowLines
  });

  it('does not render arrow lines for calculation B in non-middle columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation B are NOT rendered in left column
    const calcBLines = container.querySelectorAll('[data-testid^="calc-B-line-"]');
    expect(calcBLines).toHaveLength(0); // Should have no lines for calculation B
  });

  it('renders arrow lines for calculation E in left column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation E are rendered
    const calcELines = container.querySelectorAll('[data-testid^="calc-E-line-"]');
    expect(calcELines).toHaveLength(4); // Should have 4 line segments for arrowLines
  });

  it('does not render arrow lines for calculation E in non-left columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation E are NOT rendered in middle column
    const calcELines = container.querySelectorAll('[data-testid^="calc-E-line-"]');
    expect(calcELines).toHaveLength(0); // Should have no lines for calculation E
  });

  it('renders arrow lines for calculation H in middle column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation H are rendered
    const calcHLines = container.querySelectorAll('[data-testid^="calc-H-line-"]');
    expect(calcHLines).toHaveLength(4); // Should have 4 line segments for arrowLines
  });

  it('does not render arrow lines for calculation H in non-middle columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation H are NOT rendered in left column
    const calcHLines = container.querySelectorAll('[data-testid^="calc-H-line-"]');
    expect(calcHLines).toHaveLength(0); // Should have no lines for calculation H
  });

  it('renders arrow lines for calculation I in right column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={2}
        columnIndex={2}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation I are rendered
    const calcILines = container.querySelectorAll('[data-testid^="calc-I-line-"]');
    expect(calcILines).toHaveLength(4); // Should have 4 line segments for arrowLines
  });

  it('does not render arrow lines for calculation I in non-right columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation I are NOT rendered in left column
    const calcILines = container.querySelectorAll('[data-testid^="calc-I-line-"]');
    expect(calcILines).toHaveLength(0); // Should have no lines for calculation I
  });

  it('renders arrow lines for calculation J in right column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={2}
        columnIndex={2}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation J are rendered
    const calcJLines = container.querySelectorAll('[data-testid^="calc-J-line-"]');
    expect(calcJLines).toHaveLength(4); // Should have 4 line segments for arrowLines
  });

  it('does not render arrow lines for calculation J in non-right columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that arrow lines for calculation J are NOT rendered in middle column
    const calcJLines = container.querySelectorAll('[data-testid^="calc-J-line-"]');
    expect(calcJLines).toHaveLength(0); // Should have no lines for calculation J
  });

  it('renders inputs and outputs for right column', () => {
    render(
      <CalculatorColumn
        weekOffset={2}
        columnIndex={2}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that inputs are rendered
    expect(screen.getByTestId('price-input-I1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-I2')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-J1')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-J2')).toBeInTheDocument();

    // Check that outputs are rendered (by checking for average display components)
    const averageDisplays = screen.getAllByTestId('average-display');
    expect(averageDisplays).toHaveLength(2); // I3, J3
  });

  it('renders L-lines for A2,C1 → C2 connection in left column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for A2,C1 → C2 connection are rendered
    const a2c1c2Lines = container.querySelectorAll('[data-testid^="A2C1-C2-line-"]');
    expect(a2c1c2Lines).toHaveLength(2); // Should have 2 line segments for Llines
  });

  it('does not render L-lines for A2,C1 → C2 connection in non-left columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for A2,C1 → C2 connection are NOT rendered in middle column
    const a2c1c2Lines = container.querySelectorAll('[data-testid^="A2C1-C2-line-"]');
    expect(a2c1c2Lines).toHaveLength(0); // Should have no lines for A2,C1 → C2 connection
  });

  it('renders L-lines for D1,B2 → D2 connection in middle column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for D1,B2 → D2 connection are rendered
    const d1b2d2Lines = container.querySelectorAll('[data-testid^="D1B2-D2-line-"]');
    expect(d1b2d2Lines).toHaveLength(2); // Should have 2 line segments for Llines
  });

  it('does not render L-lines for D1,B2 → D2 connection in non-middle columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for D1,B2 → D2 connection are NOT rendered in left column
    const d1b2d2Lines = container.querySelectorAll('[data-testid^="D1B2-D2-line-"]');
    expect(d1b2d2Lines).toHaveLength(0); // Should have no lines for D1,B2 → D2 connection
  });

  it('renders L-lines for E1,F1 → F2 connection in left column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for E1,F1 → F2 connection are rendered
    const e1f1f2Lines = container.querySelectorAll('[data-testid^="E1F1-F2-line-"]');
    expect(e1f1f2Lines).toHaveLength(2); // Should have 2 line segments for Llines
  });

  it('does not render L-lines for E1,F1 → F2 connection in non-left columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for E1,F1 → F2 connection are NOT rendered in middle column
    const e1f1f2Lines = container.querySelectorAll('[data-testid^="E1F1-F2-line-"]');
    expect(e1f1f2Lines).toHaveLength(0); // Should have no lines for E1,F1 → F2 connection
  });

  it('renders L-lines for G1,H1 → G2 connection in middle column', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={1}
        columnIndex={1}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for G1,H1 → G2 connection are rendered
    const g1h1g2Lines = container.querySelectorAll('[data-testid^="G1H1-G2-line-"]');
    expect(g1h1g2Lines).toHaveLength(2); // Should have 2 line segments for Llines
  });

  it('does not render L-lines for G1,H1 → G2 connection in non-middle columns', () => {
    const { container } = render(
      <CalculatorColumn
        weekOffset={0}
        columnIndex={0}
        inputValues={mockInputValues}
        onValueChange={mockOnValueChange}
      />
    );

    // Check that SVG container exists
    const svgElement = container.querySelector('svg.connection-lines');
    expect(svgElement).toBeInTheDocument();

    // Check that L-lines for G1,H1 → G2 connection are NOT rendered in left column
    const g1h1g2Lines = container.querySelectorAll('[data-testid^="G1H1-G2-line-"]');
    expect(g1h1g2Lines).toHaveLength(0); // Should have no lines for G1,H1 → G2 connection
  });
});