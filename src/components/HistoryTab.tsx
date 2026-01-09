import React from 'react';
import { CalculatorColumn, DeleteButton } from './index';
import { HistoryTabProps } from '../types';
import './HistoryTab.css';

const HistoryTab: React.FC<HistoryTabProps> = ({
  snapshots,
  selectedSnapshot,
  onSnapshotSelect,
  onSnapshotDelete
}) => {
  // Empty state when no history exists
  if (snapshots.length === 0) {
    return (
      <div className="history-tab">
        <div className="history-empty-state">
          <div className="empty-state-icon">
            📊
          </div>
          <h2 className="empty-state-title">No History Yet</h2>
          <p className="empty-state-description">
            You haven't saved any snapshots yet. Start by entering some data in the main calculator, 
            then click the "Save" button to create your first snapshot.
          </p>
          <div className="empty-state-guidance">
            <h3>How to create your first snapshot:</h3>
            <ol className="guidance-steps">
              <li>Switch to the "Main" tab</li>
              <li>Enter your price data in the calculator</li>
              <li>Click the "Save" button to create a snapshot</li>
              <li>Return to this History tab to view your saved data</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Handle snapshot deletion
  const handleDeleteSnapshot = () => {
    if (selectedSnapshot) {
      onSnapshotDelete(selectedSnapshot.id);
    }
  };

  // History dropdown for snapshot selection
  const renderHistoryDropdown = () => {
    return (
      <div className="history-dropdown-container">
        <div className="dropdown-row">
          <label htmlFor="history-dropdown" className="dropdown-label">
            Select a saved snapshot:
          </label>
          <select
            id="history-dropdown"
            className="history-dropdown"
            value={selectedSnapshot?.id || ''}
            onChange={(e) => onSnapshotSelect(e.target.value)}
          >
            <option value="">Choose a snapshot...</option>
            {snapshots.map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id}>
                {formatSnapshotDisplay(snapshot)}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Format snapshot for dropdown display (MM/DD/YYYY HH:MM AM/PM)
  const formatSnapshotDisplay = (snapshot: any) => {
    const date = new Date(snapshot.timestamp);
    const dateStr = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr} ${timeStr}`;
  };

  // Calculate week offsets for the three columns (same as main page)
  const getWeekOffsets = () => {
    return [0, 1, 2]; // This week, next week, week after next
  };

  const weekOffsets = getWeekOffsets();

  return (
    <div className="history-tab">
      {/* History dropdown */}
      {renderHistoryDropdown()}
      
      {/* Calculator display area - same layout as main page */}
      {selectedSnapshot ? (
        <div className="history-calculator-container">
          <div className="app-container">
            {/* Delete button positioned at bottom left inside the container */}
            <div className="save-button-container">
              <DeleteButton 
                onDelete={handleDeleteSnapshot}
                disabled={!selectedSnapshot}
              />
            </div>
            
            {weekOffsets.map((weekOffset, index) => (
              <CalculatorColumn
                key={`history-column-${index}`}
                weekOffset={weekOffset}
                columnIndex={index}
                inputValues={selectedSnapshot.inputValues}
                onValueChange={() => {}} // Read-only in history view
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="history-no-selection">
          <p className="no-selection-message">
            Select a snapshot from the dropdown above to view historical data.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;