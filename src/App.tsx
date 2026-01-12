import { useState, useEffect } from 'react';
import './App.css';
import { UnifiedCalculator, TabNavigation, SaveButton, ClearButton, HistoryTab } from './components';
import { InputValues, TabType, HistorySnapshot } from './types';
import { 
  validateConfiguration
} from './config/calculatorConfig';
import { historyService } from './services/HistoryService';

function App() {
  // Validate configuration on app initialization
  validateConfiguration();

  // Extended state management for data history functionality
  const [inputValues, setInputValues] = useState<InputValues>({
    // Left column (本周五)
    A1: 0,
    A2: 0,
    C1: 0,
    E1: 0,
    E2: 0,
    F1: 0,
    
    // Middle column (下周五)
    B1: 0,
    B2: 0,
    D1: 0,
    G1: 0,
    H1: 0,
    H2: 0,
    
    // Right column (下下周五)
    I1: 0,
    I2: 0,
    J1: 0,
    J2: 0,
  });

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabType>('main');
  
  // History data management
  const [historySnapshots, setHistorySnapshots] = useState<HistorySnapshot[]>([]);
  const [selectedHistorySnapshot, setSelectedHistorySnapshot] = useState<HistorySnapshot | null>(null);

  // Load auto-saved data and history snapshots on component mount
  useEffect(() => {
    // Load auto-saved input values if available
    const autoSavedData = historyService.loadAutoSave();
    if (autoSavedData) {
      setInputValues(autoSavedData);
    }

    // Load existing history snapshots
    const snapshots = historyService.loadSnapshots();
    setHistorySnapshots(snapshots);
  }, []);

  // Auto-save trigger on input changes
  useEffect(() => {
    // Trigger auto-save whenever input values change
    // The HistoryService handles debouncing internally
    historyService.autoSave(inputValues);
  }, [inputValues]);

  // Handle state updates and propagation with auto-save integration
  const handleValueChange = (id: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
    // Auto-save is triggered by the useEffect above
  };

  // Handler functions for tab changes, manual saves, and snapshot selection
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleManualSave = () => {
    const snapshot = historyService.saveSnapshot(inputValues);
    setHistorySnapshots(prev => [...prev, snapshot]);
  };

  const handleClearAll = () => {
    const clearedValues: InputValues = {
      // Left column (本周五)
      A1: 0,
      A2: 0,
      C1: 0,
      E1: 0,
      E2: 0,
      F1: 0,
      
      // Middle column (下周五)
      B1: 0,
      B2: 0,
      D1: 0,
      G1: 0,
      H1: 0,
      H2: 0,
      
      // Right column (下下周五)
      I1: 0,
      I2: 0,
      J1: 0,
      J2: 0,
    };
    setInputValues(clearedValues);
  };

  const handleSnapshotSelect = (snapshotId: string) => {
    const snapshot = historySnapshots.find(s => s.id === snapshotId) || null;
    setSelectedHistorySnapshot(snapshot);
  };

  const handleSnapshotDelete = (snapshotId: string) => {
    // Delete the snapshot using the history service
    historyService.deleteSnapshot(snapshotId);
    
    // Update the local state by removing the deleted snapshot
    setHistorySnapshots(prev => prev.filter(s => s.id !== snapshotId));
    
    // If the deleted snapshot was selected, clear the selection
    if (selectedHistorySnapshot?.id === snapshotId) {
      setSelectedHistorySnapshot(null);
    }
  };

  // Format current date for display
  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="app">
      {/* Current date display in top left corner */}
      <div className="current-date">
        {getCurrentDate()}
      </div>
      
      {/* Tab navigation */}
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Conditional rendering based on active tab */}
      {activeTab === 'main' ? (
        <div className="main-tab">
          {/* Unified calculator layout */}
          <div className="app-container-unified">
            {/* Unified calculator with all inputs and outputs */}
            <UnifiedCalculator
              inputValues={inputValues}
              onValueChange={handleValueChange}
            />
            
            {/* Save and Clear buttons positioned below the graph */}
            <div className="save-button-container">
              <SaveButton onSave={handleManualSave} />
              <ClearButton onClear={handleClearAll} />
            </div>
          </div>
        </div>
      ) : (
        <HistoryTab
          snapshots={historySnapshots}
          selectedSnapshot={selectedHistorySnapshot}
          onSnapshotSelect={handleSnapshotSelect}
          onSnapshotDelete={handleSnapshotDelete}
        />
      )}
    </div>
  );
}

export default App;