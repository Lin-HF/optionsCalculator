import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AverageDisplay from './AverageDisplay';

describe('AverageDisplay', () => {
  it('renders label and formatted value correctly', () => {
    render(<AverageDisplay value={25.5} label="A3" />);
    
    expect(screen.getByText('A3:')).toBeInTheDocument();
    expect(screen.getByText('25.5')).toBeInTheDocument();
  });

  it('formats integer values without decimal places', () => {
    render(<AverageDisplay value={30} label="B3" />);
    
    expect(screen.getByText('B3:')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('formats decimal values with appropriate precision', () => {
    render(<AverageDisplay value={33.333333} label="C2" />);
    
    expect(screen.getByText('C2:')).toBeInTheDocument();
    expect(screen.getByText('33.33')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    render(<AverageDisplay value={0} label="D2" />);
    
    expect(screen.getByText('D2:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles negative values correctly', () => {
    render(<AverageDisplay value={-15.75} label="E3" />);
    
    expect(screen.getByText('E3:')).toBeInTheDocument();
    expect(screen.getByText('-15.75')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<AverageDisplay value={42.1} label="F2" />);
    
    const displayElement = container.querySelector('.average-display');
    expect(displayElement).toBeInTheDocument();
    expect(displayElement).toHaveClass('average-display');
    
    const labelElement = container.querySelector('.average-label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('average-label');
    
    const valueElement = container.querySelector('.average-value');
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass('average-value');
  });

  it('handles very small decimal values', () => {
    render(<AverageDisplay value={0.01} label="G2" />);
    
    expect(screen.getByText('G2:')).toBeInTheDocument();
    expect(screen.getByText('0.01')).toBeInTheDocument();
  });

  it('rounds values to 2 decimal places maximum', () => {
    render(<AverageDisplay value={12.999999} label="H3" />);
    
    expect(screen.getByText('H3:')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
  });
});