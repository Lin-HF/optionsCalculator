// Core type definitions for the price calculator

// Input values state type
export type InputValues = {
  // Left column (本周五)
  A1: number;
  A2: number;
  C1: number;
  E1: number;
  E2: number;
  F1: number;
  
  // Middle column (下周五)
  B1: number;
  B2: number;
  D1: number;
  G1: number;
  H1: number;
  H2: number;
  
  // Right column (下下周五)
  I1: number;
  I2: number;
  J1: number;
  J2: number;
};

// Output configuration for calculations
export interface OutputConfig {
  id: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  inputs: string[]; // Input IDs that participate in calculation
}

// Calculation configuration type
export type CalculationConfig = {
  [key: string]: {
    inputs: string[];
    position: 'left' | 'right' | 'top' | 'bottom';
  };
};

// Note: CALCULATIONS configuration moved to src/config/calculatorConfig.ts

// Component prop interfaces
export interface AppProps {}

export interface AppState {
  // 所有输入值的状态
  inputValues: Record<string, number>;
}

export interface DateHeaderProps {
  weekOffset: number; // 0=本周, 1=下周, 2=下下周
}

export interface CalculatorColumnProps {
  weekOffset: number;
  columnIndex: number;
  inputValues: Record<string, number>;
  onValueChange: (id: string, value: number) => void;
}

export interface CalculatorGroupConfig {
  input1Id: string;
  input2Id: string;
  outputs: OutputConfig[];
}

export interface CalculatorGroupProps {
  input1Id: string;
  input2Id: string;
  outputs: OutputConfig[];
  onValueChange: (id: string, value: number) => void;
}

export interface PriceInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  color?: 'red' | 'green';
}

export interface AverageDisplayProps {
  value: number;
}

// Data History Types

// Storage keys for localStorage
export enum StorageKeys {
  AUTO_SAVE = 'price_calculator_auto_save',
  HISTORY_SNAPSHOTS = 'price_calculator_history'
}

// Historical snapshot of calculator state
export interface HistorySnapshot {
  id: string;
  timestamp: number;
  inputValues: InputValues;
  label?: string; // Optional user-defined label
  displayName?: string; // Formatted display name with date/time for dropdown
}

// History service interface for data persistence
export interface IHistoryService {
  // Auto-save functionality
  autoSave(inputValues: InputValues): void;
  loadAutoSave(): InputValues | null;
  
  // Manual save functionality
  saveSnapshot(inputValues: InputValues, label?: string): HistorySnapshot;
  loadSnapshots(): HistorySnapshot[];
  deleteSnapshot(id: string): void;
  
  // Storage management
  clearAllData(): void;
  getStorageInfo(): { used: number; available: number };
  
  // Error handling and recovery
  getLastError(): string | null;
  clearLastError(): void;
  isStorageAvailable(): boolean;
}

// Tab navigation types
export type TabType = 'main' | 'strike' | 'history';

// Component prop interfaces for new data history components

export interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface SaveButtonProps {
  onSave: () => void;
  disabled?: boolean;
}

export interface HistoryDropdownProps {
  snapshots: HistorySnapshot[];
  selectedSnapshotId: string | null;
  onSnapshotSelect: (snapshotId: string) => void;
}

export interface HistoryTabProps {
  snapshots: HistorySnapshot[];
  selectedSnapshot: HistorySnapshot | null;
  onSnapshotSelect: (snapshotId: string) => void;
  onSnapshotDelete: (snapshotId: string) => void;
}

// Validation error type
export interface ValidationError {
  pairId: string; // e.g., "A1-A2"
  message: string;
  firstInput: string;
  secondInput: string;
}

// Extended App state for data history functionality
export interface ExtendedAppState extends AppState {
  activeTab: TabType;
  historySnapshots: HistorySnapshot[];
  selectedHistorySnapshot: HistorySnapshot | null;
  validationErrors: ValidationError[];
}

// Line drawing types for graph connections
export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  orientation: 'horizontal' | 'vertical';
}

export interface ArrowLinesResult {
  lines: LineSegment[];
  connectionPoints: {
    a1: { x: number; y: number };
    a2: { x: number; y: number };
    b1: { x: number; y: number };
    b2: { x: number; y: number };
    c1: { x: number; y: number };
    c2: { x: number; y: number };
    d1: { x: number; y: number };
    d2: { x: number; y: number };
  };
}

export type LlineRotation = 'bottomLeftCorner' | 'bottomRightCorner' | 'topLeftCorner' | 'topRightCorner';

export interface LlinesResult {
  lines: LineSegment[];
  connectionPoints: {
    v1: { x: number; y: number };
    v2: { x: number; y: number };
    h1: { x: number; y: number };
    h2: { x: number; y: number };
  };
}