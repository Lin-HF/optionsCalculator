import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DeleteButton from './DeleteButton';

describe('DeleteButton', () => {
  it('renders delete button with correct text', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} />);
    
    const button = screen.getByRole('button', { name: /delete snapshot/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onDelete when clicked', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} />);
    
    const button = screen.getByRole('button', { name: /delete snapshot/i });
    fireEvent.click(button);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS class', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} />);
    
    const button = screen.getByRole('button', { name: /delete snapshot/i });
    expect(button).toHaveClass('clear-button');
  });

  it('can be disabled', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /delete snapshot/i });
    expect(button).toBeDisabled();
  });

  it('does not call onDelete when disabled and clicked', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /delete snapshot/i });
    fireEvent.click(button);
    
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});