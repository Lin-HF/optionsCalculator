import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DateHeader from './DateHeader';

describe('DateHeader', () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15')); // Monday, January 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the current week Friday date with correct format', () => {
    render(<DateHeader weekOffset={0} />);
    
    // For Monday Jan 15, 2024, this Friday would be Jan 19, 2024
    expect(screen.getByText('This Friday: 01.19')).toBeInTheDocument();
  });

  it('should render the next week Friday date with correct format', () => {
    render(<DateHeader weekOffset={1} />);
    
    // Next Friday would be Jan 26, 2024
    expect(screen.getByText('Next Friday: 01.26')).toBeInTheDocument();
  });

  it('should render the week after next Friday date with correct format', () => {
    render(<DateHeader weekOffset={2} />);
    
    // Week after next Friday would be Feb 2, 2024
    expect(screen.getByText('Friday After Next: 02.02')).toBeInTheDocument();
  });

  it('should have proper CSS classes applied', () => {
    render(<DateHeader weekOffset={0} />);
    
    const dateHeader = screen.getByRole('heading', { level: 2 });
    expect(dateHeader).toHaveClass('date-title');
    expect(dateHeader.parentElement).toHaveClass('date-header');
  });

  it('should handle different weekOffset values correctly', () => {
    const { rerender } = render(<DateHeader weekOffset={0} />);
    expect(screen.getByText(/This Friday/)).toBeInTheDocument();

    rerender(<DateHeader weekOffset={1} />);
    expect(screen.getByText(/Next Friday/)).toBeInTheDocument();

    rerender(<DateHeader weekOffset={2} />);
    expect(screen.getByText(/Friday After Next/)).toBeInTheDocument();
  });
});