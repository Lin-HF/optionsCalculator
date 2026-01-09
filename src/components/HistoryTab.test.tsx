import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HistoryTab from './HistoryTab';
import { HistorySnapshot } from '../types';

describe('HistoryTab', () => {
  const mockOnSnapshotSelect = vi.fn();

  describe('Empty State Handling', () => {
    it('displays empty state message when no snapshots exist', () => {
      render(
        <HistoryTab
          snapshots={[]}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      // Check for empty state elements
      expect(screen.getByText('No History Yet')).toBeInTheDocument();
      expect(screen.getByText(/You haven't saved any snapshots yet/)).toBeInTheDocument();
      expect(screen.getByText('How to create your first snapshot:')).toBeInTheDocument();
      
      // Check for guidance steps
      expect(screen.getByText('Switch to the "Main" tab')).toBeInTheDocument();
      expect(screen.getByText('Enter your price data in the calculator')).toBeInTheDocument();
      expect(screen.getByText('Click the "Save" button to create a snapshot')).toBeInTheDocument();
      expect(screen.getByText('Return to this History tab to view your saved data')).toBeInTheDocument();
    });

    it('displays empty state icon', () => {
      render(
        <HistoryTab
          snapshots={[]}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      const icon = screen.getByText('📊');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('empty-state-icon');
    });

    it('does not display dropdown when no snapshots exist', () => {
      render(
        <HistoryTab
          snapshots={[]}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      expect(screen.queryByText('Select a saved snapshot:')).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  describe('With Snapshots', () => {
    const mockSnapshots: HistorySnapshot[] = [
      {
        id: 'snapshot-1',
        timestamp: new Date('2024-01-15T10:30:00').getTime(),
        inputValues: {
          A1: 100,
          A2: 200,
          B1: 150,
          B2: 250,
          C1: 0,
          D1: 0,
          E1: 0,
          E2: 0,
          F1: 0,
          G1: 0,
          H1: 0,
          H2: 0,
          I1: 0,
          I2: 0,
          J1: 0,
          J2: 0,
        }
      }
    ];

    it('displays dropdown when snapshots exist', () => {
      render(
        <HistoryTab
          snapshots={mockSnapshots}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      expect(screen.getByText('Select a saved snapshot:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('does not display empty state when snapshots exist', () => {
      render(
        <HistoryTab
          snapshots={mockSnapshots}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      expect(screen.queryByText('No History Yet')).not.toBeInTheDocument();
      expect(screen.queryByText(/You haven't saved any snapshots yet/)).not.toBeInTheDocument();
    });

    it('displays no selection message when no snapshot is selected', () => {
      render(
        <HistoryTab
          snapshots={mockSnapshots}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      expect(screen.getByText('Select a snapshot from the dropdown above to view historical data.')).toBeInTheDocument();
    });

    it('formats snapshot timestamps correctly in dropdown', () => {
      render(
        <HistoryTab
          snapshots={mockSnapshots}
          selectedSnapshot={null}
          onSnapshotSelect={mockOnSnapshotSelect}
        />
      );

      // Check that the formatted timestamp appears in the dropdown
      expect(screen.getByText('01/15/2024 10:30 AM')).toBeInTheDocument();
    });
  });
});