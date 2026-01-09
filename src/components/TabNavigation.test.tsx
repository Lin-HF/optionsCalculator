import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TabNavigation from './TabNavigation';

describe('TabNavigation', () => {
  it('renders both Main and History tabs', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="main" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('shows Main tab as active when activeTab is main', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="main" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    const mainButton = screen.getByText('Main');
    const historyButton = screen.getByText('History');
    
    expect(mainButton).toHaveClass('active');
    expect(historyButton).not.toHaveClass('active');
  });

  it('shows History tab as active when activeTab is history', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="history" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    const mainButton = screen.getByText('Main');
    const historyButton = screen.getByText('History');
    
    expect(historyButton).toHaveClass('active');
    expect(mainButton).not.toHaveClass('active');
  });

  it('calls onTabChange with main when Main tab is clicked', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="history" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    const mainButton = screen.getByText('Main');
    fireEvent.click(mainButton);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('main');
  });

  it('calls onTabChange with history when History tab is clicked', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="main" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    const historyButton = screen.getByText('History');
    fireEvent.click(historyButton);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('history');
  });

  it('has proper button types to prevent form submission', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="main" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    const mainButton = screen.getByText('Main');
    const historyButton = screen.getByText('History');
    
    expect(mainButton).toHaveAttribute('type', 'button');
    expect(historyButton).toHaveAttribute('type', 'button');
  });

  it('applies correct CSS classes for styling', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <TabNavigation 
        activeTab="main" 
        onTabChange={mockOnTabChange} 
      />
    );
    
    const container = screen.getByText('Main').closest('.tab-navigation');
    const buttonsContainer = screen.getByText('Main').closest('.tab-buttons');
    const mainButton = screen.getByText('Main');
    const historyButton = screen.getByText('History');
    
    expect(container).toHaveClass('tab-navigation');
    expect(buttonsContainer).toHaveClass('tab-buttons');
    expect(mainButton).toHaveClass('tab-button');
    expect(historyButton).toHaveClass('tab-button');
  });
});