import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AverageDisplay from './AverageDisplay';

describe('AverageDisplay', () => {
  it('renders formatted value correctly', () => {
    render(<AverageDisplay value={25.5} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('25.5')).toBeInTheDocument();
  });

  it('formats integer values without decimal places', () => {
    render(<AverageDisplay value={30} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('formats decimal values with appropriate precision', () => {
    render(<AverageDisplay value={33.333333} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('33.33')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    render(<AverageDisplay value={0} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles negative values correctly', () => {
    render(<AverageDisplay value={-15.75} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('-15.75')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<AverageDisplay value={42.1} />);
    
    const containerElement = container.querySelector('.average-display-container');
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveClass('average-display-container');
    
    const valueElement = container.querySelector('.average-value');
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass('average-value');
  });

  it('handles very small decimal values', () => {
    render(<AverageDisplay value={0.01} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('0.01')).toBeInTheDocument();
  });

  it('rounds values to 2 decimal places maximum', () => {
    render(<AverageDisplay value={12.999999} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
  });
});