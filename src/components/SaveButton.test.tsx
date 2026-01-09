import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SaveButton from './SaveButton';

describe('SaveButton', () => {
  it('renders with default text', () => {
    const mockOnSave = vi.fn();
    render(<SaveButton onSave={mockOnSave} />);
    
    expect(screen.getByRole('button', { name: /save current data as snapshot/i })).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onSave when clicked', async () => {
    const mockOnSave = vi.fn().mockResolvedValue(undefined);
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    fireEvent.click(button);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('shows loading state during save operation', async () => {
    const mockOnSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByText('Saved!')).toBeInTheDocument();
    });
  });

  it('shows success state after successful save', async () => {
    const mockOnSave = vi.fn().mockResolvedValue(undefined);
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Saved!')).toBeInTheDocument();
    });
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnSave = vi.fn();
    render(<SaveButton onSave={mockOnSave} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('handles save errors gracefully', async () => {
    const mockOnSave = vi.fn().mockRejectedValue(new Error('Save failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Save operation failed:', expect.any(Error));
    });
    
    // Button should return to normal state after error
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('prevents multiple clicks during save operation', async () => {
    const mockOnSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    
    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    // Should only be called once
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes for different states', async () => {
    const mockOnSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    
    // Initial state
    expect(button).toHaveClass('save-button');
    expect(button).not.toHaveClass('save-button--loading');
    expect(button).not.toHaveClass('save-button--success');
    
    // Click to start save
    fireEvent.click(button);
    
    // Loading state
    expect(button).toHaveClass('save-button--loading');
    
    // Wait for success state
    await waitFor(() => {
      expect(button).toHaveClass('save-button--success');
    });
  });

  it('applies disabled class when disabled', () => {
    const mockOnSave = vi.fn();
    render(<SaveButton onSave={mockOnSave} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /save current data as snapshot/i });
    expect(button).toHaveClass('save-button--disabled');
  });
});