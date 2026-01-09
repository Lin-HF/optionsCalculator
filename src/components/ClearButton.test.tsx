import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ClearButton from './ClearButton';

describe('ClearButton', () => {
  it('renders clear button with correct text', () => {
    const mockOnClear = vi.fn();
    render(<ClearButton onClear={mockOnClear} />);
    
    const button = screen.getByRole('button', { name: /clear all/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClear when clicked', () => {
    const mockOnClear = vi.fn();
    render(<ClearButton onClear={mockOnClear} />);
    
    const button = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(button);
    
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS class', () => {
    const mockOnClear = vi.fn();
    render(<ClearButton onClear={mockOnClear} />);
    
    const button = screen.getByRole('button', { name: /clear all/i });
    expect(button).toHaveClass('clear-button');
  });
});