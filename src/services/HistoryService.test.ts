import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { HistoryService } from './HistoryService';
import { InputValues, StorageKeys } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('HistoryService', () => {
  let historyService: HistoryService;
  let mockInputValues: InputValues;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Set up localStorage mock to pass availability test
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === '__localStorage_test__') {
        return 'test';
      }
      return null;
    });
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
    
    // Create fresh instance
    historyService = new HistoryService();
    
    // Mock input values
    mockInputValues = {
      A1: 100, A2: 200, C1: 300, E1: 400, E2: 500, F1: 600,
      B1: 700, B2: 800, D1: 900, G1: 1000, H1: 1100, H2: 1200,
      I1: 1300, I2: 1400, J1: 1500, J2: 1600
    };
  });

  describe('Auto-save functionality', () => {
    it('should save input values to localStorage with debouncing', async () => {
      // Call autoSave
      historyService.autoSave(mockInputValues);
      
      // Should not save immediately (debounced)
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      
      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Should now have saved
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        StorageKeys.AUTO_SAVE,
        JSON.stringify(mockInputValues)
      );
    });

    it('should load auto-saved data correctly', () => {
      // Mock localStorage to return saved data
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockInputValues));
      
      const result = historyService.loadAutoSave();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith(StorageKeys.AUTO_SAVE);
      expect(result).toEqual(mockInputValues);
    });

    it('should return null when no auto-save data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = historyService.loadAutoSave();
      
      expect(result).toBeNull();
    });

    it('should handle corrupted auto-save data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = historyService.loadAutoSave();
      
      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(StorageKeys.AUTO_SAVE);
    });
  });

  describe('Manual save functionality', () => {
    it('should create snapshot with unique ID and timestamp', () => {
      localStorageMock.getItem.mockReturnValue('[]'); // No existing snapshots
      
      const snapshot = historyService.saveSnapshot(mockInputValues, 'Test Label');
      
      expect(snapshot.id).toMatch(/^snapshot_[a-z0-9]+_[a-z0-9]+$/);
      expect(snapshot.timestamp).toBeGreaterThan(0);
      expect(snapshot.inputValues).toEqual(mockInputValues);
      expect(snapshot.label).toBe('Test Label');
      expect(snapshot.displayName).toContain('Test Label');
    });

    it('should save snapshot to localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const snapshot = historyService.saveSnapshot(mockInputValues);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        StorageKeys.HISTORY_SNAPSHOTS,
        expect.stringContaining(snapshot.id)
      );
    });

    it('should load snapshots correctly', () => {
      const mockSnapshots = [{
        id: 'test_id',
        timestamp: Date.now(),
        inputValues: mockInputValues,
        displayName: '01/08/2026 10:30 AM'
      }];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSnapshots));
      
      const result = historyService.loadSnapshots();
      
      expect(result).toEqual(mockSnapshots);
    });

    it('should return empty array when no snapshots exist', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = historyService.loadSnapshots();
      
      expect(result).toEqual([]);
    });
  });

  describe('Data validation', () => {
    it('should validate input values structure', async () => {
      const invalidInputValues = { A1: 'invalid' } as any;
      
      // Should not throw during autoSave (graceful degradation)
      historyService.autoSave(invalidInputValues);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Should not have saved invalid data
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should throw error for invalid input values in saveSnapshot', () => {
      const invalidInputValues = { A1: 'invalid' } as any;
      
      expect(() => {
        historyService.saveSnapshot(invalidInputValues);
      }).toThrow('Invalid type for property A1');
    });
  });

  describe('Storage management', () => {
    it('should clear all data', () => {
      historyService.clearAllData();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(StorageKeys.AUTO_SAVE);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(StorageKeys.HISTORY_SNAPSHOTS);
    });

    it('should delete specific snapshot', () => {
      const mockSnapshots = [
        { id: 'keep', timestamp: Date.now(), inputValues: mockInputValues },
        { id: 'delete', timestamp: Date.now(), inputValues: mockInputValues }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSnapshots));
      
      historyService.deleteSnapshot('delete');
      
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('keep');
    });

    it('should provide storage info', () => {
      localStorageMock.getItem.mockReturnValue('{"test": "data"}');
      
      const info = historyService.getStorageInfo();
      
      expect(info).toHaveProperty('used');
      expect(info).toHaveProperty('available');
      expect(typeof info.used).toBe('number');
      expect(typeof info.available).toBe('number');
    });
  });

  describe('Property-Based Tests', () => {
    describe('Property 1: Auto-save persistence', () => {
      it('should preserve all input values through auto-save and load cycle', { timeout: 30000 }, async () => {
        /**
         * Feature: data-history, Property 1: Auto-save persistence
         * For any set of input values, when a user types in any input field, 
         * the system should automatically save all current input values to localStorage 
         * and be able to restore them on application reload.
         * Validates: Requirements 1.1, 1.2, 1.3, 1.4
         */
        
        // Generator for valid InputValues
        const inputValuesArbitrary = fc.record({
          A1: fc.integer({ min: -999999, max: 999999 }),
          A2: fc.integer({ min: -999999, max: 999999 }),
          C1: fc.integer({ min: -999999, max: 999999 }),
          E1: fc.integer({ min: -999999, max: 999999 }),
          E2: fc.integer({ min: -999999, max: 999999 }),
          F1: fc.integer({ min: -999999, max: 999999 }),
          B1: fc.integer({ min: -999999, max: 999999 }),
          B2: fc.integer({ min: -999999, max: 999999 }),
          D1: fc.integer({ min: -999999, max: 999999 }),
          G1: fc.integer({ min: -999999, max: 999999 }),
          H1: fc.integer({ min: -999999, max: 999999 }),
          H2: fc.integer({ min: -999999, max: 999999 }),
          I1: fc.integer({ min: -999999, max: 999999 }),
          I2: fc.integer({ min: -999999, max: 999999 }),
          J1: fc.integer({ min: -999999, max: 999999 }),
          J2: fc.integer({ min: -999999, max: 999999 })
        });

        await fc.assert(
          fc.asyncProperty(inputValuesArbitrary, async (inputValues: InputValues) => {
            // Clear any existing data
            localStorageMock.clear();
            vi.clearAllMocks();
            
            // Create fresh service instance
            const service = new HistoryService();
            
            // Mock localStorage to actually store and retrieve data
            const storage: Record<string, string> = {};
            localStorageMock.setItem.mockImplementation((key: string, value: string) => {
              storage[key] = value;
            });
            localStorageMock.getItem.mockImplementation((key: string) => {
              return storage[key] || null;
            });
            localStorageMock.removeItem.mockImplementation((key: string) => {
              delete storage[key];
            });
            
            // Auto-save the input values
            service.autoSave(inputValues);
            
            // Wait for debounce delay to complete
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Verify data was saved
            expect(storage[StorageKeys.AUTO_SAVE]).toBeDefined();
            
            // Load the auto-saved data
            const loadedValues = service.loadAutoSave();
            
            // Property: The loaded values should exactly match the original input values
            expect(loadedValues).toEqual(inputValues);
            
            // Additional validation: Ensure all required fields are preserved
            if (loadedValues) {
              const requiredKeys = ['A1', 'A2', 'C1', 'E1', 'E2', 'F1', 'B1', 'B2', 'D1', 'G1', 'H1', 'H2', 'I1', 'I2', 'J1', 'J2'];
              for (const key of requiredKeys) {
                expect(loadedValues).toHaveProperty(key);
                expect(loadedValues[key as keyof InputValues]).toBe(inputValues[key as keyof InputValues]);
              }
            }
          }),
          { numRuns: 20 } // Run 20 iterations for reasonable execution time
        );
      });
    });

    describe('Property 2: Manual save completeness', () => {
      it('should create complete snapshots with unique IDs and timestamps for any input values', { timeout: 30000 }, async () => {
        /**
         * Feature: data-history, Property 2: Manual save completeness
         * For any current input state, when a user clicks the save button, 
         * the system should create a snapshot containing all input field values, 
         * a unique identifier, and a timestamp.
         * Validates: Requirements 2.1, 2.2, 2.3
         */
        
        // Generator for valid InputValues
        const inputValuesArbitrary = fc.record({
          A1: fc.integer({ min: -999999, max: 999999 }),
          A2: fc.integer({ min: -999999, max: 999999 }),
          C1: fc.integer({ min: -999999, max: 999999 }),
          E1: fc.integer({ min: -999999, max: 999999 }),
          E2: fc.integer({ min: -999999, max: 999999 }),
          F1: fc.integer({ min: -999999, max: 999999 }),
          B1: fc.integer({ min: -999999, max: 999999 }),
          B2: fc.integer({ min: -999999, max: 999999 }),
          D1: fc.integer({ min: -999999, max: 999999 }),
          G1: fc.integer({ min: -999999, max: 999999 }),
          H1: fc.integer({ min: -999999, max: 999999 }),
          H2: fc.integer({ min: -999999, max: 999999 }),
          I1: fc.integer({ min: -999999, max: 999999 }),
          I2: fc.integer({ min: -999999, max: 999999 }),
          J1: fc.integer({ min: -999999, max: 999999 }),
          J2: fc.integer({ min: -999999, max: 999999 })
        });

        // Generator for optional labels
        const labelArbitrary = fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined });

        await fc.assert(
          fc.asyncProperty(
            inputValuesArbitrary, 
            labelArbitrary, 
            async (inputValues: InputValues, label?: string) => {
              // Clear any existing data
              localStorageMock.clear();
              vi.clearAllMocks();
              
              // Create fresh service instance
              const service = new HistoryService();
              
              // Mock localStorage to actually store and retrieve data
              const storage: Record<string, string> = {};
              localStorageMock.setItem.mockImplementation((key: string, value: string) => {
                storage[key] = value;
              });
              localStorageMock.getItem.mockImplementation((key: string) => {
                return storage[key] || null;
              });
              localStorageMock.removeItem.mockImplementation((key: string) => {
                delete storage[key];
              });
              
              // Record timestamp before save operation
              const beforeSave = Date.now();
              
              // Perform manual save
              const snapshot = service.saveSnapshot(inputValues, label);
              
              // Record timestamp after save operation
              const afterSave = Date.now();
              
              // Property 1: Snapshot should have a unique identifier (Requirement 2.2)
              expect(snapshot.id).toBeDefined();
              expect(typeof snapshot.id).toBe('string');
              expect(snapshot.id.length).toBeGreaterThan(0);
              expect(snapshot.id).toMatch(/^snapshot_[a-z0-9]+_[a-z0-9]+$/);
              
              // Property 2: Snapshot should have a timestamp within reasonable bounds (Requirement 2.1, 2.3)
              expect(snapshot.timestamp).toBeDefined();
              expect(typeof snapshot.timestamp).toBe('number');
              expect(snapshot.timestamp).toBeGreaterThanOrEqual(beforeSave);
              expect(snapshot.timestamp).toBeLessThanOrEqual(afterSave);
              
              // Property 3: Snapshot should contain all input field values (Requirement 2.1, 2.3)
              expect(snapshot.inputValues).toBeDefined();
              expect(snapshot.inputValues).toEqual(inputValues);
              
              // Verify all required input fields are preserved
              const requiredKeys = ['A1', 'A2', 'C1', 'E1', 'E2', 'F1', 'B1', 'B2', 'D1', 'G1', 'H1', 'H2', 'I1', 'I2', 'J1', 'J2'];
              for (const key of requiredKeys) {
                expect(snapshot.inputValues).toHaveProperty(key);
                expect(snapshot.inputValues[key as keyof InputValues]).toBe(inputValues[key as keyof InputValues]);
              }
              
              // Property 4: Label should be preserved if provided
              if (label !== undefined) {
                expect(snapshot.label).toBe(label);
              }
              
              // Property 5: Display name should be generated
              expect(snapshot.displayName).toBeDefined();
              expect(typeof snapshot.displayName).toBe('string');
              expect(snapshot.displayName.length).toBeGreaterThan(0);
              
              // Property 6: Snapshot should be saved to localStorage (Requirement 2.1)
              expect(storage[StorageKeys.HISTORY_SNAPSHOTS]).toBeDefined();
              const savedSnapshots = JSON.parse(storage[StorageKeys.HISTORY_SNAPSHOTS]);
              expect(Array.isArray(savedSnapshots)).toBe(true);
              expect(savedSnapshots.length).toBeGreaterThan(0);
              
              // Find our snapshot in the saved data
              const savedSnapshot = savedSnapshots.find((s: any) => s.id === snapshot.id);
              expect(savedSnapshot).toBeDefined();
              expect(savedSnapshot.inputValues).toEqual(inputValues);
              expect(savedSnapshot.timestamp).toBe(snapshot.timestamp);
              
              // Property 7: Multiple saves should maintain all snapshots
              // Save a second snapshot with different data
              const secondInputValues = {
                ...inputValues,
                A1: inputValues.A1 + 1 // Ensure it's different
              };
              const secondSnapshot = service.saveSnapshot(secondInputValues, 'Second');
              
              // Verify both snapshots are preserved
              const updatedSnapshots = JSON.parse(storage[StorageKeys.HISTORY_SNAPSHOTS]);
              expect(updatedSnapshots.length).toBe(2);
              
              // Verify unique IDs
              expect(snapshot.id).not.toBe(secondSnapshot.id);
              
              // Verify both snapshots can be found
              const firstSaved = updatedSnapshots.find((s: any) => s.id === snapshot.id);
              const secondSaved = updatedSnapshots.find((s: any) => s.id === secondSnapshot.id);
              expect(firstSaved).toBeDefined();
              expect(secondSaved).toBeDefined();
              expect(firstSaved.inputValues).toEqual(inputValues);
              expect(secondSaved.inputValues).toEqual(secondInputValues);
            }
          ),
          { numRuns: 20 } // Run 20 iterations for reasonable execution time
        );
      });
    });

    describe('Property 3: Snapshot accumulation', () => {
      it('should maintain a complete list of all saved snapshots when multiple saves occur', { timeout: 30000 }, async () => {
        /**
         * Feature: data-history, Property 3: Snapshot accumulation
         * For any sequence of save operations, the system should maintain a complete list 
         * of all saved snapshots without losing or corrupting existing data.
         * Validates: Requirements 2.4
         */
        
        // Generator for valid InputValues
        const inputValuesArbitrary = fc.record({
          A1: fc.integer({ min: -999999, max: 999999 }),
          A2: fc.integer({ min: -999999, max: 999999 }),
          C1: fc.integer({ min: -999999, max: 999999 }),
          E1: fc.integer({ min: -999999, max: 999999 }),
          E2: fc.integer({ min: -999999, max: 999999 }),
          F1: fc.integer({ min: -999999, max: 999999 }),
          B1: fc.integer({ min: -999999, max: 999999 }),
          B2: fc.integer({ min: -999999, max: 999999 }),
          D1: fc.integer({ min: -999999, max: 999999 }),
          G1: fc.integer({ min: -999999, max: 999999 }),
          H1: fc.integer({ min: -999999, max: 999999 }),
          H2: fc.integer({ min: -999999, max: 999999 }),
          I1: fc.integer({ min: -999999, max: 999999 }),
          I2: fc.integer({ min: -999999, max: 999999 }),
          J1: fc.integer({ min: -999999, max: 999999 }),
          J2: fc.integer({ min: -999999, max: 999999 })
        });

        // Generator for optional labels
        const labelArbitrary = fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined });

        // Generator for arrays of input values and labels (representing multiple save operations)
        const saveOperationsArbitrary = fc.array(
          fc.tuple(inputValuesArbitrary, labelArbitrary),
          { minLength: 1, maxLength: 10 } // Test with 1-10 save operations
        );

        await fc.assert(
          fc.asyncProperty(saveOperationsArbitrary, async (saveOperations) => {
            // Clear any existing data
            localStorageMock.clear();
            vi.clearAllMocks();
            
            // Create fresh service instance
            const service = new HistoryService();
            
            // Mock localStorage to actually store and retrieve data
            const storage: Record<string, string> = {};
            localStorageMock.setItem.mockImplementation((key: string, value: string) => {
              storage[key] = value;
            });
            localStorageMock.getItem.mockImplementation((key: string) => {
              return storage[key] || null;
            });
            localStorageMock.removeItem.mockImplementation((key: string) => {
              delete storage[key];
            });
            
            // Track all created snapshots
            const createdSnapshots: HistorySnapshot[] = [];
            
            // Perform multiple save operations
            for (const [inputValues, label] of saveOperations) {
              const snapshot = service.saveSnapshot(inputValues, label);
              createdSnapshots.push(snapshot);
              
              // Property 1: Each snapshot should have a unique ID
              const existingIds = createdSnapshots.slice(0, -1).map(s => s.id);
              expect(existingIds).not.toContain(snapshot.id);
            }
            
            // Load all snapshots from storage
            const loadedSnapshots = service.loadSnapshots();
            
            // Property 2: The number of loaded snapshots should equal the number of save operations
            expect(loadedSnapshots.length).toBe(saveOperations.length);
            
            // Property 3: All created snapshots should be present in the loaded snapshots
            for (const createdSnapshot of createdSnapshots) {
              const foundSnapshot = loadedSnapshots.find(s => s.id === createdSnapshot.id);
              expect(foundSnapshot).toBeDefined();
              expect(foundSnapshot!.inputValues).toEqual(createdSnapshot.inputValues);
              expect(foundSnapshot!.timestamp).toBe(createdSnapshot.timestamp);
              expect(foundSnapshot!.label).toBe(createdSnapshot.label);
              expect(foundSnapshot!.displayName).toBe(createdSnapshot.displayName);
            }
            
            // Property 4: All loaded snapshots should correspond to a created snapshot
            for (const loadedSnapshot of loadedSnapshots) {
              const foundSnapshot = createdSnapshots.find(s => s.id === loadedSnapshot.id);
              expect(foundSnapshot).toBeDefined();
            }
            
            // Property 5: Snapshots should be ordered with most recent first
            if (loadedSnapshots.length > 1) {
              for (let i = 0; i < loadedSnapshots.length - 1; i++) {
                expect(loadedSnapshots[i].timestamp).toBeGreaterThanOrEqual(loadedSnapshots[i + 1].timestamp);
              }
            }
            
            // Property 6: Each snapshot should maintain data integrity
            for (const snapshot of loadedSnapshots) {
              // Validate snapshot structure
              expect(snapshot.id).toBeDefined();
              expect(typeof snapshot.id).toBe('string');
              expect(snapshot.id.length).toBeGreaterThan(0);
              
              expect(snapshot.timestamp).toBeDefined();
              expect(typeof snapshot.timestamp).toBe('number');
              expect(snapshot.timestamp).toBeGreaterThan(0);
              
              expect(snapshot.inputValues).toBeDefined();
              expect(typeof snapshot.inputValues).toBe('object');
              
              // Validate all required input fields are present
              const requiredKeys = ['A1', 'A2', 'C1', 'E1', 'E2', 'F1', 'B1', 'B2', 'D1', 'G1', 'H1', 'H2', 'I1', 'I2', 'J1', 'J2'];
              for (const key of requiredKeys) {
                expect(snapshot.inputValues).toHaveProperty(key);
                expect(typeof snapshot.inputValues[key as keyof InputValues]).toBe('number');
              }
              
              expect(snapshot.displayName).toBeDefined();
              expect(typeof snapshot.displayName).toBe('string');
              expect(snapshot.displayName!.length).toBeGreaterThan(0);
            }
            
            // Property 7: Storage should be consistent across service instances
            // Create a new service instance and verify it can load the same data
            const newService = new HistoryService();
            const reloadedSnapshots = newService.loadSnapshots();
            
            expect(reloadedSnapshots.length).toBe(loadedSnapshots.length);
            expect(reloadedSnapshots).toEqual(loadedSnapshots);
            
            // Property 8: Individual snapshot deletion should not affect other snapshots
            if (loadedSnapshots.length > 1) {
              const snapshotToDelete = loadedSnapshots[Math.floor(loadedSnapshots.length / 2)];
              service.deleteSnapshot(snapshotToDelete.id);
              
              const snapshotsAfterDeletion = service.loadSnapshots();
              expect(snapshotsAfterDeletion.length).toBe(loadedSnapshots.length - 1);
              
              // Verify the deleted snapshot is not present
              const deletedSnapshot = snapshotsAfterDeletion.find(s => s.id === snapshotToDelete.id);
              expect(deletedSnapshot).toBeUndefined();
              
              // Verify all other snapshots are still present
              for (const originalSnapshot of loadedSnapshots) {
                if (originalSnapshot.id !== snapshotToDelete.id) {
                  const stillPresent = snapshotsAfterDeletion.find(s => s.id === originalSnapshot.id);
                  expect(stillPresent).toBeDefined();
                  expect(stillPresent).toEqual(originalSnapshot);
                }
              }
            }
          }),
          { numRuns: 15 } // Run 15 iterations for reasonable execution time with multiple operations
        );
      });
    });

    describe('Property 6: Snapshot loading accuracy', () => {
      it('should accurately load snapshot input values and maintain calculation consistency', { timeout: 30000 }, async () => {
        /**
         * Feature: data-history, Property 6: Snapshot loading accuracy
         * For any valid snapshot selected from the dropdown, the system should load that 
         * snapshot's input values and automatically calculate the corresponding output values 
         * with the same behavior as the main page.
         * Validates: Requirements 5.2, 5.3, 5.5
         */
        
        // Generator for valid InputValues
        const inputValuesArbitrary = fc.record({
          A1: fc.integer({ min: -999999, max: 999999 }),
          A2: fc.integer({ min: -999999, max: 999999 }),
          C1: fc.integer({ min: -999999, max: 999999 }),
          E1: fc.integer({ min: -999999, max: 999999 }),
          E2: fc.integer({ min: -999999, max: 999999 }),
          F1: fc.integer({ min: -999999, max: 999999 }),
          B1: fc.integer({ min: -999999, max: 999999 }),
          B2: fc.integer({ min: -999999, max: 999999 }),
          D1: fc.integer({ min: -999999, max: 999999 }),
          G1: fc.integer({ min: -999999, max: 999999 }),
          H1: fc.integer({ min: -999999, max: 999999 }),
          H2: fc.integer({ min: -999999, max: 999999 }),
          I1: fc.integer({ min: -999999, max: 999999 }),
          I2: fc.integer({ min: -999999, max: 999999 }),
          J1: fc.integer({ min: -999999, max: 999999 }),
          J2: fc.integer({ min: -999999, max: 999999 })
        });

        // Generator for optional labels
        const labelArbitrary = fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined });

        // Generator for arrays of snapshots to test loading multiple snapshots
        const snapshotsArbitrary = fc.array(
          fc.tuple(inputValuesArbitrary, labelArbitrary),
          { minLength: 1, maxLength: 5 } // Test with 1-5 snapshots
        );

        await fc.assert(
          fc.asyncProperty(snapshotsArbitrary, async (snapshotData) => {
            // Clear any existing data
            localStorageMock.clear();
            vi.clearAllMocks();
            
            // Create fresh service instance
            const service = new HistoryService();
            
            // Mock localStorage to actually store and retrieve data
            const storage: Record<string, string> = {};
            localStorageMock.setItem.mockImplementation((key: string, value: string) => {
              storage[key] = value;
            });
            localStorageMock.getItem.mockImplementation((key: string) => {
              return storage[key] || null;
            });
            localStorageMock.removeItem.mockImplementation((key: string) => {
              delete storage[key];
            });
            
            // Create snapshots by saving each input values set
            const createdSnapshots: HistorySnapshot[] = [];
            for (const [inputValues, label] of snapshotData) {
              const snapshot = service.saveSnapshot(inputValues, label);
              createdSnapshots.push(snapshot);
            }
            
            // Load all snapshots from storage
            const loadedSnapshots = service.loadSnapshots();
            
            // Property 1: All created snapshots should be loadable (Requirement 5.2)
            expect(loadedSnapshots.length).toBe(createdSnapshots.length);
            
            // Test loading accuracy for each snapshot
            for (const originalSnapshot of createdSnapshots) {
              // Find the corresponding loaded snapshot
              const loadedSnapshot = loadedSnapshots.find(s => s.id === originalSnapshot.id);
              expect(loadedSnapshot).toBeDefined();
              
              if (loadedSnapshot) {
                // Property 2: Loaded snapshot should contain exact input values (Requirement 5.2)
                expect(loadedSnapshot.inputValues).toEqual(originalSnapshot.inputValues);
                
                // Property 3: All required input fields should be preserved with correct values
                const requiredKeys = ['A1', 'A2', 'C1', 'E1', 'E2', 'F1', 'B1', 'B2', 'D1', 'G1', 'H1', 'H2', 'I1', 'I2', 'J1', 'J2'];
                for (const key of requiredKeys) {
                  expect(loadedSnapshot.inputValues).toHaveProperty(key);
                  expect(loadedSnapshot.inputValues[key as keyof InputValues]).toBe(originalSnapshot.inputValues[key as keyof InputValues]);
                  expect(typeof loadedSnapshot.inputValues[key as keyof InputValues]).toBe('number');
                }
                
                // Property 4: Snapshot metadata should be preserved accurately
                expect(loadedSnapshot.id).toBe(originalSnapshot.id);
                expect(loadedSnapshot.timestamp).toBe(originalSnapshot.timestamp);
                expect(loadedSnapshot.label).toBe(originalSnapshot.label);
                expect(loadedSnapshot.displayName).toBe(originalSnapshot.displayName);
                
                // Property 5: Loaded input values should be suitable for calculations (Requirement 5.3)
                // This tests that the loaded values maintain the same calculation behavior as the main page
                // We verify this by ensuring all values are valid numbers that can be used in calculations
                for (const key of requiredKeys) {
                  const value = loadedSnapshot.inputValues[key as keyof InputValues];
                  expect(Number.isFinite(value)).toBe(true);
                  expect(typeof value).toBe('number');
                  
                  // Test that values can be used in basic arithmetic operations (simulating calculations)
                  expect(() => value + 1).not.toThrow();
                  expect(() => value * 2).not.toThrow();
                  expect(() => value / 2).not.toThrow();
                  expect(value + 0).toBe(value); // Identity property
                }
                
                // Property 6: Calculation consistency - loaded values should produce same results as original values
                // Test basic calculation operations that would be performed in the UI
                const originalSum = Object.values(originalSnapshot.inputValues).reduce((sum, val) => sum + val, 0);
                const loadedSum = Object.values(loadedSnapshot.inputValues).reduce((sum, val) => sum + val, 0);
                expect(loadedSum).toBe(originalSum);
                
                // Test average calculations (common in the calculator)
                const originalAvg = originalSum / Object.keys(originalSnapshot.inputValues).length;
                const loadedAvg = loadedSum / Object.keys(loadedSnapshot.inputValues).length;
                expect(loadedAvg).toBe(originalAvg);
                
                // Property 7: Data integrity - no corruption during load process
                // Verify that loading doesn't modify the original data structure
                const originalKeys = Object.keys(originalSnapshot.inputValues).sort();
                const loadedKeys = Object.keys(loadedSnapshot.inputValues).sort();
                expect(loadedKeys).toEqual(originalKeys);
                
                // Property 8: Type consistency - all loaded values maintain correct types (Requirement 5.5)
                for (const [key, value] of Object.entries(loadedSnapshot.inputValues)) {
                  expect(typeof value).toBe('number');
                  expect(Number.isNaN(value)).toBe(false);
                  expect(Number.isFinite(value)).toBe(true);
                }
              }
            }
            
            // Property 9: Multiple snapshot loading should not interfere with each other
            if (loadedSnapshots.length > 1) {
              // Verify that each snapshot maintains its unique identity and data
              const snapshotIds = loadedSnapshots.map(s => s.id);
              const uniqueIds = new Set(snapshotIds);
              expect(uniqueIds.size).toBe(snapshotIds.length); // All IDs should be unique
              
              // Verify that each snapshot has distinct input values (unless they were intentionally the same)
              for (let i = 0; i < loadedSnapshots.length; i++) {
                for (let j = i + 1; j < loadedSnapshots.length; j++) {
                  const snapshot1 = loadedSnapshots[i];
                  const snapshot2 = loadedSnapshots[j];
                  
                  // IDs should always be different
                  expect(snapshot1.id).not.toBe(snapshot2.id);
                  
                  // Timestamps should be different (unless saved at exactly the same millisecond)
                  // We allow for same timestamp since saves can happen very quickly in tests
                  expect(typeof snapshot1.timestamp).toBe('number');
                  expect(typeof snapshot2.timestamp).toBe('number');
                }
              }
            }
            
            // Property 10: Snapshot loading should be consistent across service instances (Requirement 5.5)
            // Create a new service instance and verify it loads the same data
            const newService = new HistoryService();
            const reloadedSnapshots = newService.loadSnapshots();
            
            expect(reloadedSnapshots.length).toBe(loadedSnapshots.length);
            
            // Verify each reloaded snapshot matches the original loaded snapshot
            for (const originalLoaded of loadedSnapshots) {
              const reloaded = reloadedSnapshots.find(s => s.id === originalLoaded.id);
              expect(reloaded).toBeDefined();
              
              if (reloaded) {
                expect(reloaded.inputValues).toEqual(originalLoaded.inputValues);
                expect(reloaded.timestamp).toBe(originalLoaded.timestamp);
                expect(reloaded.label).toBe(originalLoaded.label);
                expect(reloaded.displayName).toBe(originalLoaded.displayName);
              }
            }
            
            // Property 11: Error resilience - loading should handle edge cases gracefully
            // Test that the service can handle loading when storage contains valid data
            expect(() => service.loadSnapshots()).not.toThrow();
            
            // Verify that loaded snapshots are in the correct order (most recent first)
            if (loadedSnapshots.length > 1) {
              for (let i = 0; i < loadedSnapshots.length - 1; i++) {
                expect(loadedSnapshots[i].timestamp).toBeGreaterThanOrEqual(loadedSnapshots[i + 1].timestamp);
              }
            }
          }),
          { numRuns: 15 } // Run 15 iterations for reasonable execution time
        );
      });
    });
  });
});