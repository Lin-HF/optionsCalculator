import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';
import { ValidationError } from '../types';

describe('ErrorDisplay', () => {
  const mockError: ValidationError = {
    pairId: 'A1-A2',
    message: 'A1 must be less than A2',
    firstInput: 'A1',
    secondInput: 'A2'
  };

  const mockPosition = { x: 100, y: 200 };

  it('should render error message when error is provided', () => {
    render(<ErrorDisplay error={mockError} position={mockPosition} />);
    
    const errorElement = screen.getByTestId('error-A1-A2');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('A1 must be less than A2');
  });

  it('should position error at specified coordinates', () => {
    render(<ErrorDisplay error={mockError} position={mockPosition} />);
    
    const errorElement = screen.getByTestId('error-A1-A2');
    expect(errorElement).toHaveStyle({
      position: 'absolute',
      left: '100px',
      top: '200px'
    });
  });

  it('should not render when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} position={mockPosition} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should have correct CSS classes', () => {
    render(<ErrorDisplay error={mockError} position={mockPosition} />);
    
    const errorElement = screen.getByTestId('error-A1-A2');
    expect(errorElement).toHaveClass('error-display');
    
    const messageElement = errorElement.querySelector('.error-message');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent('A1 must be less than A2');
  });

  it('should render different error messages for different pairs', () => {
    const error1: ValidationError = {
      pairId: 'B1-B2',
      message: 'B1 must be less than B2',
      firstInput: 'B1',
      secondInput: 'B2'
    };

    const { rerender } = render(<ErrorDisplay error={error1} position={mockPosition} />);
    expect(screen.getByText('B1 must be less than B2')).toBeInTheDocument();

    const error2: ValidationError = {
      pairId: 'I1-I2',
      message: 'I1 must be less than I2',
      firstInput: 'I1',
      secondInput: 'I2'
    };

    rerender(<ErrorDisplay error={error2} position={mockPosition} />);
    expect(screen.getByText('I1 must be less than I2')).toBeInTheDocument();
  });

  it('should have high z-index for visibility', () => {
    render(<ErrorDisplay error={mockError} position={mockPosition} />);
    
    const errorElement = screen.getByTestId('error-A1-A2');
    expect(errorElement).toHaveStyle({ zIndex: '10' });
  });
});
