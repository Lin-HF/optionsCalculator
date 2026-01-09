import { InputValues, HistorySnapshot, IHistoryService, StorageKeys } from '../types';

/**
 * HistoryService provides data persistence functionality for the price calculator
 * Implements auto-save with debouncing and manual save with unique ID generation
 * Includes comprehensive error handling and graceful degradation
 */
export class HistoryService implements IHistoryService {
  private autoSaveTimeout: number | null = null;
  private readonly AUTO_SAVE_DELAY = 500; // 500ms debounce delay
  private isLocalStorageAvailable: boolean = true;
  private lastErrorMessage: string | null = null;

  constructor() {
    // Test localStorage availability on initialization
    this.checkLocalStorageAvailability();
  }

  /**
   * Check if localStorage is available and functional
   * Sets internal flag for graceful degradation
   */
  private checkLocalStorageAvailability(): void {
    try {
      const testKey = '__localStorage_test__';
      const testValue = 'test';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      this.isLocalStorageAvailable = retrieved === testValue;
      
      if (!this.isLocalStorageAvailable) {
        this.lastErrorMessage = 'localStorage is not functioning properly';
        console.warn('localStorage test failed - data persistence will be disabled');
      }
    } catch (error) {
      this.isLocalStorageAvailable = false;
      this.lastErrorMessage = 'localStorage is not available or disabled';
      console.warn('localStorage is not available - data persistence will be disabled', error);
    }
  }

  /**
   * Get the last error message for user feedback
   */
  getLastError(): string | null {
    return this.lastErrorMessage;
  }

  /**
   * Clear the last error message
   */
  clearLastError(): void {
    this.lastErrorMessage = null;
  }

  /**
   * Check if storage features are available
   */
  isStorageAvailable(): boolean {
    return this.isLocalStorageAvailable;
  }

  /**
   * Auto-save functionality with debouncing
   * Saves input values to localStorage after a delay to avoid excessive writes
   * Includes graceful degradation when localStorage is unavailable
   */
  autoSave(inputValues: InputValues): void {
    // Clear existing timeout to implement debouncing
    if (this.autoSaveTimeout) {
      window.clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout for debounced save
    this.autoSaveTimeout = window.setTimeout(() => {
      // Graceful degradation: skip auto-save if localStorage is unavailable
      if (!this.isLocalStorageAvailable) {
        console.warn('Auto-save skipped: localStorage is not available');
        return;
      }

      try {
        this.validateInputValues(inputValues);
        const serializedData = JSON.stringify(inputValues);
        
        // Attempt to save with error recovery
        this.safeLocalStorageSetItem(StorageKeys.AUTO_SAVE, serializedData);
        this.clearLastError(); // Clear any previous errors on success
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during auto-save';
        this.lastErrorMessage = `Auto-save failed: ${errorMessage}`;
        console.error('Auto-save failed:', error);
        
        // Attempt recovery by checking localStorage availability
        this.checkLocalStorageAvailability();
      }
    }, this.AUTO_SAVE_DELAY);
  }

  /**
   * Load auto-saved data from localStorage
   * Returns null if no data exists or if data is corrupted
   * Includes enhanced error recovery and graceful degradation
   */
  loadAutoSave(): InputValues | null {
    // Graceful degradation: return null if localStorage is unavailable
    if (!this.isLocalStorageAvailable) {
      console.warn('Load auto-save skipped: localStorage is not available');
      return null;
    }

    try {
      const savedData = this.safeLocalStorageGetItem(StorageKeys.AUTO_SAVE);
      if (!savedData) {
        return null;
      }

      const parsedData = this.safeJsonParse(savedData, 'auto-save data');
      this.validateInputValues(parsedData);
      this.clearLastError(); // Clear any previous errors on success
      return parsedData as InputValues;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading auto-save data';
      this.lastErrorMessage = `Failed to load auto-save data: ${errorMessage}`;
      console.error('Failed to load auto-save data:', error);
      
      // Attempt data recovery by clearing corrupted data
      this.attemptDataRecovery(StorageKeys.AUTO_SAVE, 'auto-save');
      
      // Re-check localStorage availability
      this.checkLocalStorageAvailability();
      
      return null;
    }
  }

  /**
   * Manual save functionality with unique ID generation
   * Creates a snapshot with timestamp and optional label
   * Includes enhanced error handling and user feedback
   */
  saveSnapshot(inputValues: InputValues, label?: string): HistorySnapshot {
    // Check localStorage availability first
    if (!this.isLocalStorageAvailable) {
      const errorMessage = 'Cannot save snapshot: localStorage is not available';
      this.lastErrorMessage = errorMessage;
      throw new Error(errorMessage);
    }

    try {
      this.validateInputValues(inputValues);
      
      const snapshot: HistorySnapshot = {
        id: this.generateUniqueId(),
        timestamp: Date.now(),
        inputValues: { ...inputValues }, // Create a copy to avoid mutations
        label,
        displayName: this.formatDisplayName(Date.now(), label)
      };

      // Load existing snapshots with error recovery
      const existingSnapshots = this.loadSnapshots();
      
      // Add new snapshot to the beginning of the array (most recent first)
      const updatedSnapshots = [snapshot, ...existingSnapshots];
      
      // Save updated snapshots list with enhanced error handling
      this.saveSnapshotsToStorageWithRecovery(updatedSnapshots);
      
      this.clearLastError(); // Clear any previous errors on success
      return snapshot;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during snapshot save';
      this.lastErrorMessage = `Failed to save snapshot: ${errorMessage}`;
      console.error('Failed to save snapshot:', error);
      
      // Re-check localStorage availability
      this.checkLocalStorageAvailability();
      
      throw new Error(this.lastErrorMessage);
    }
  }

  /**
   * Load all saved snapshots from localStorage
   * Returns empty array if no snapshots exist or if data is corrupted
   * Includes enhanced error recovery and data validation
   */
  loadSnapshots(): HistorySnapshot[] {
    // Graceful degradation: return empty array if localStorage is unavailable
    if (!this.isLocalStorageAvailable) {
      console.warn('Load snapshots skipped: localStorage is not available');
      return [];
    }

    try {
      const savedData = this.safeLocalStorageGetItem(StorageKeys.HISTORY_SNAPSHOTS);
      if (!savedData) {
        return [];
      }

      const parsedData = this.safeJsonParse(savedData, 'snapshots data');
      if (!Array.isArray(parsedData)) {
        throw new Error('Invalid snapshots data format: expected array');
      }

      // Validate and filter snapshots with enhanced recovery
      const validSnapshots = this.validateAndRecoverSnapshots(parsedData);
      
      this.clearLastError(); // Clear any previous errors on success
      return validSnapshots;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading snapshots';
      this.lastErrorMessage = `Failed to load snapshots: ${errorMessage}`;
      console.error('Failed to load snapshots:', error);
      
      // Attempt data recovery
      this.attemptDataRecovery(StorageKeys.HISTORY_SNAPSHOTS, 'snapshots');
      
      // Re-check localStorage availability
      this.checkLocalStorageAvailability();
      
      return [];
    }
  }

  /**
   * Delete a specific snapshot by ID
   * Includes enhanced error handling and user feedback
   */
  deleteSnapshot(id: string): void {
    // Check localStorage availability first
    if (!this.isLocalStorageAvailable) {
      const errorMessage = 'Cannot delete snapshot: localStorage is not available';
      this.lastErrorMessage = errorMessage;
      throw new Error(errorMessage);
    }

    try {
      const snapshots = this.loadSnapshots();
      const filteredSnapshots = snapshots.filter(snapshot => snapshot.id !== id);
      
      // Check if snapshot was actually found and removed
      if (filteredSnapshots.length === snapshots.length) {
        const errorMessage = `Snapshot with ID ${id} not found`;
        this.lastErrorMessage = errorMessage;
        throw new Error(errorMessage);
      }
      
      this.saveSnapshotsToStorageWithRecovery(filteredSnapshots);
      this.clearLastError(); // Clear any previous errors on success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during snapshot deletion';
      this.lastErrorMessage = `Failed to delete snapshot: ${errorMessage}`;
      console.error('Failed to delete snapshot:', error);
      
      // Re-check localStorage availability
      this.checkLocalStorageAvailability();
      
      throw new Error(this.lastErrorMessage);
    }
  }

  /**
   * Clear all stored data (both auto-save and snapshots)
   * Includes enhanced error handling and graceful degradation
   */
  clearAllData(): void {
    // If localStorage is not available, there's nothing to clear
    if (!this.isLocalStorageAvailable) {
      console.warn('Clear all data skipped: localStorage is not available');
      this.lastErrorMessage = 'Cannot clear data: localStorage is not available';
      return; // Don't throw error for clear operations
    }

    const errors: string[] = [];
    
    try {
      this.safeLocalStorageRemoveItem(StorageKeys.AUTO_SAVE);
    } catch (error) {
      const errorMessage = `Failed to clear auto-save data: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMessage);
      console.error(errorMessage);
    }
    
    try {
      this.safeLocalStorageRemoveItem(StorageKeys.HISTORY_SNAPSHOTS);
    } catch (error) {
      const errorMessage = `Failed to clear snapshots data: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMessage);
      console.error(errorMessage);
    }
    
    if (errors.length > 0) {
      this.lastErrorMessage = `Partial clear completed with errors: ${errors.join('; ')}`;
      // Don't throw for clear operations - partial success is acceptable
    } else {
      this.clearLastError(); // Clear any previous errors on success
    }
    
    // Re-check localStorage availability after clear operations
    this.checkLocalStorageAvailability();
  }

  /**
   * Get storage usage information
   * Returns approximate storage usage in bytes
   * Includes enhanced error handling and graceful degradation
   */
  getStorageInfo(): { used: number; available: number } {
    // If localStorage is not available, return zeros
    if (!this.isLocalStorageAvailable) {
      console.warn('Storage info unavailable: localStorage is not available');
      return { used: 0, available: 0 };
    }

    try {
      let used = 0;
      
      // Calculate used storage for our keys with error handling
      try {
        const autoSaveData = this.safeLocalStorageGetItem(StorageKeys.AUTO_SAVE);
        if (autoSaveData) {
          used += new Blob([autoSaveData]).size;
        }
      } catch (error) {
        console.warn('Failed to get auto-save data size:', error);
      }
      
      try {
        const snapshotsData = this.safeLocalStorageGetItem(StorageKeys.HISTORY_SNAPSHOTS);
        if (snapshotsData) {
          used += new Blob([snapshotsData]).size;
        }
      } catch (error) {
        console.warn('Failed to get snapshots data size:', error);
      }

      // Estimate available storage (localStorage typically has 5-10MB limit)
      // This is an approximation since we can't directly query localStorage quota
      const estimatedTotal = 5 * 1024 * 1024; // 5MB estimate
      const available = Math.max(0, estimatedTotal - used);

      this.clearLastError(); // Clear any previous errors on success
      return { used, available };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error getting storage info';
      this.lastErrorMessage = `Failed to get storage info: ${errorMessage}`;
      console.error('Failed to get storage info:', error);
      
      // Re-check localStorage availability
      this.checkLocalStorageAvailability();
      
      return { used: 0, available: 0 };
    }
  }

  /**
   * Safe wrapper for localStorage.setItem with error handling
   */
  private safeLocalStorageSetItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      } else if (error instanceof Error && error.name === 'SecurityError') {
        this.isLocalStorageAvailable = false;
        throw new Error('localStorage access denied (private browsing mode or security settings)');
      } else {
        throw new Error(`localStorage write failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Safe wrapper for localStorage.getItem with error handling
   */
  private safeLocalStorageGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      if (error instanceof Error && error.name === 'SecurityError') {
        this.isLocalStorageAvailable = false;
        throw new Error('localStorage access denied (private browsing mode or security settings)');
      } else {
        throw new Error(`localStorage read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Safe wrapper for localStorage.removeItem with error handling
   */
  private safeLocalStorageRemoveItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      if (error instanceof Error && error.name === 'SecurityError') {
        this.isLocalStorageAvailable = false;
        throw new Error('localStorage access denied (private browsing mode or security settings)');
      } else {
        console.warn(`localStorage remove failed for key ${key}:`, error);
        // Don't throw for remove operations - they're often used in cleanup
      }
    }
  }

  /**
   * Safe JSON parsing with enhanced error messages
   */
  private safeJsonParse(data: string, context: string): any {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Invalid JSON in ${context}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  /**
   * Attempt to recover from data corruption by clearing corrupted data
   */
  private attemptDataRecovery(storageKey: string, dataType: string): void {
    console.warn(`Attempting to recover from corrupted ${dataType} data`);
    
    try {
      this.safeLocalStorageRemoveItem(storageKey);
      console.log(`Successfully cleared corrupted ${dataType} data`);
    } catch (clearError) {
      console.error(`Failed to clear corrupted ${dataType} data:`, clearError);
      // If we can't even clear the data, localStorage might be completely unavailable
      this.isLocalStorageAvailable = false;
    }
  }

  /**
   * Validate and recover snapshots array with enhanced error handling
   */
  private validateAndRecoverSnapshots(parsedData: any[]): HistorySnapshot[] {
    const validSnapshots: HistorySnapshot[] = [];
    const invalidSnapshots: any[] = [];
    
    for (const snapshot of parsedData) {
      try {
        this.validateSnapshot(snapshot);
        validSnapshots.push(snapshot);
      } catch (error) {
        console.warn('Invalid snapshot found:', error);
        invalidSnapshots.push(snapshot);
      }
    }
    
    // If we found invalid snapshots, save the cleaned data back to storage
    if (invalidSnapshots.length > 0) {
      console.log(`Recovered ${validSnapshots.length} valid snapshots, removed ${invalidSnapshots.length} invalid ones`);
      
      try {
        // Save the cleaned data back to storage
        this.saveSnapshotsToStorageWithRecovery(validSnapshots);
      } catch (saveError) {
        console.warn('Failed to save cleaned snapshots data:', saveError);
        // Continue with the valid snapshots even if we can't save the cleaned version
      }
    }
    
    return validSnapshots;
  }

  /**
   * Enhanced version of saveSnapshotsToStorage with better error recovery
   */
  private saveSnapshotsToStorageWithRecovery(snapshots: HistorySnapshot[]): void {
    try {
      const serializedData = JSON.stringify(snapshots);
      this.safeLocalStorageSetItem(StorageKeys.HISTORY_SNAPSHOTS, serializedData);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Storage quota exceeded')) {
        // Handle storage quota exceeded by removing oldest snapshots
        this.handleStorageQuotaExceededWithRecovery(snapshots);
      } else {
        throw error;
      }
    }
  }

  /**
   * Enhanced storage quota handling with better recovery mechanisms
   */
  private handleStorageQuotaExceededWithRecovery(snapshots: HistorySnapshot[]): void {
    console.warn('Storage quota exceeded, attempting recovery by removing oldest snapshots');
    
    if (snapshots.length === 0) {
      throw new Error('Storage quota exceeded and no snapshots to remove');
    }
    
    // Try progressively smaller snapshot arrays
    let reducedSnapshots = [...snapshots];
    const maxAttempts = Math.min(10, snapshots.length); // Don't try more times than we have snapshots
    let attempts = 0;
    let removedCount = 0;
    
    while (reducedSnapshots.length > 0 && attempts < maxAttempts) {
      // Remove oldest snapshot (from the end of array)
      reducedSnapshots.pop();
      removedCount++;
      attempts++;
      
      try {
        const serializedData = JSON.stringify(reducedSnapshots);
        this.safeLocalStorageSetItem(StorageKeys.HISTORY_SNAPSHOTS, serializedData);
        
        console.log(`Successfully saved ${reducedSnapshots.length} snapshots after removing ${removedCount} oldest entries`);
        
        // Update error message to inform user about the cleanup
        this.lastErrorMessage = `Storage quota exceeded. Removed ${removedCount} oldest snapshots to free space.`;
        
        return;
      } catch (error) {
        // Continue trying with fewer snapshots
        if (attempts >= maxAttempts) {
          console.error('Failed to save snapshots even after removing oldest entries');
          throw new Error(`Storage quota exceeded. Unable to save snapshots after removing ${removedCount} entries.`);
        }
      }
    }
    
    // If we get here, we couldn't save even with no snapshots
    throw new Error('Storage quota exceeded and unable to save any snapshots. Storage may be completely full.');
  }

  /**
   * Generate a unique ID for snapshots
   * Uses timestamp and random component for uniqueness
   */
  private generateUniqueId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `snapshot_${timestamp}_${randomPart}`;
  }

  /**
   * Format display name for dropdown showing date and time
   * Format: MM/DD/YYYY HH:MM AM/PM
   */
  private formatDisplayName(timestamp: number, label?: string): string {
    const date = new Date(timestamp);
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
    
    const formattedDateTime = `${dateStr} ${timeStr}`;
    return label ? `${label} (${formattedDateTime})` : formattedDateTime;
  }

  /**
   * Validate InputValues structure
   */
  private validateInputValues(inputValues: any): void {
    if (!inputValues || typeof inputValues !== 'object') {
      throw new Error('Invalid input values: must be an object');
    }

    // Check for required properties based on InputValues type
    const requiredKeys = ['A1', 'A2', 'C1', 'E1', 'E2', 'F1', 'B1', 'B2', 'D1', 'G1', 'H1', 'H2', 'I1', 'I2', 'J1', 'J2'];
    
    for (const key of requiredKeys) {
      if (!(key in inputValues)) {
        throw new Error(`Missing required property: ${key}`);
      }
      if (typeof inputValues[key] !== 'number') {
        throw new Error(`Invalid type for property ${key}: expected number, got ${typeof inputValues[key]}`);
      }
    }
  }

  /**
   * Validate HistorySnapshot structure
   */
  private validateSnapshot(snapshot: any): void {
    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Invalid snapshot: must be an object');
    }

    if (typeof snapshot.id !== 'string' || !snapshot.id) {
      throw new Error('Invalid snapshot: id must be a non-empty string');
    }

    if (typeof snapshot.timestamp !== 'number' || snapshot.timestamp <= 0) {
      throw new Error('Invalid snapshot: timestamp must be a positive number');
    }

    if (!snapshot.inputValues) {
      throw new Error('Invalid snapshot: inputValues is required');
    }

    this.validateInputValues(snapshot.inputValues);

    // Optional fields validation
    if (snapshot.label !== undefined && typeof snapshot.label !== 'string') {
      throw new Error('Invalid snapshot: label must be a string if provided');
    }

    if (snapshot.displayName !== undefined && typeof snapshot.displayName !== 'string') {
      throw new Error('Invalid snapshot: displayName must be a string if provided');
    }
  }
}

// Export singleton instance
export const historyService = new HistoryService();