import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PriceInput from './PriceInput';

describe('PriceInput Component', () => {
  it('renders with correct styling and attributes', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('price-input');
    expect(input).toHaveClass('price-input--red'); // Default color
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('inputMode', 'decimal');
  });

  it('renders dollar sign', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('applies correct color class for red variant', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} color="red" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('price-input--red');
  });

  it('applies correct color class for green variant', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} color="green" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('price-input--green');
  });

  it('displays empty string when value is 0', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('displays numeric value when value is non-zero', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={25.5} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('25.50');
  });

  it('handles valid numeric input correctly', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '42.5' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(42.5);
  });

  it('treats empty input as 0 (requirement 7.1)', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={25} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it('ignores invalid non-numeric input (requirement 7.3)', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={25} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    
    // Should not call onChange for invalid input
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('accepts negative numbers (requirement 7.3)', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-15.5' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(-15.5);
  });

  it('accepts decimal numbers (requirement 7.4)', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.456' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(123.456);
  });

  it('uses custom placeholder when provided', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} placeholder="Enter price" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter price');
  });

  it('uses default placeholder when not provided', () => {
    const mockOnChange = vi.fn();
    render(<PriceInput id="test-input" value={0} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '0');
  });
});