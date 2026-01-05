import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getFridayDate, formatDate, getFormattedFridayDate } from './dateUtils';

describe('Date Utils', () => {
  describe('getFridayDate', () => {
    it('should return a Friday date', () => {
      const friday = getFridayDate(0);
      expect(friday.getDay()).toBe(5); // Friday is day 5
    });

    it('should return dates 7 days apart for consecutive weeks', () => {
      const thisWeekFriday = getFridayDate(0);
      const nextWeekFriday = getFridayDate(1);
      const weekAfterFriday = getFridayDate(2);
      
      const daysDiff1 = (nextWeekFriday.getTime() - thisWeekFriday.getTime()) / (1000 * 60 * 60 * 24);
      const daysDiff2 = (weekAfterFriday.getTime() - nextWeekFriday.getTime()) / (1000 * 60 * 60 * 24);
      
      expect(daysDiff1).toBe(7);
      expect(daysDiff2).toBe(7);
    });

    // **Feature: price-calculator, Property 1: Friday date calculation correctness**
    // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
    it('property: Friday dates should be exactly 0, 7, and 14 days apart relative to nearest Friday', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
          (currentDate) => {
            // Normalize the current date to start of day to avoid time precision issues
            const normalizedCurrentDate = new Date(currentDate);
            normalizedCurrentDate.setHours(0, 0, 0, 0);
            
            // Mock the current date for consistent testing
            const originalDate = Date;
            const MockedDate = class extends Date {
              constructor(...args: any[]) {
                if (args.length === 0) {
                  super(normalizedCurrentDate);
                } else {
                  super(...args);
                }
              }
              static now() {
                return normalizedCurrentDate.getTime();
              }
            } as any;
            
            // Temporarily replace Date constructor
            global.Date = MockedDate;
            
            try {
              const thisWeekFriday = getFridayDate(0);
              const nextWeekFriday = getFridayDate(1);
              const weekAfterFriday = getFridayDate(2);
              
              // All returned dates should be Fridays
              expect(thisWeekFriday.getDay()).toBe(5);
              expect(nextWeekFriday.getDay()).toBe(5);
              expect(weekAfterFriday.getDay()).toBe(5);
              
              // Normalize all dates to start of day for precise comparison
              const normalizedThisWeek = new Date(thisWeekFriday);
              normalizedThisWeek.setHours(0, 0, 0, 0);
              const normalizedNextWeek = new Date(nextWeekFriday);
              normalizedNextWeek.setHours(0, 0, 0, 0);
              const normalizedWeekAfter = new Date(weekAfterFriday);
              normalizedWeekAfter.setHours(0, 0, 0, 0);
              
              // Calculate days difference using normalized dates
              const daysDiff1 = Math.round((normalizedNextWeek.getTime() - normalizedThisWeek.getTime()) / (1000 * 60 * 60 * 24));
              const daysDiff2 = Math.round((normalizedWeekAfter.getTime() - normalizedThisWeek.getTime()) / (1000 * 60 * 60 * 24));
              
              // Should be exactly 7 days apart between consecutive weeks
              expect(daysDiff1).toBe(7);
              // Should be exactly 14 days apart between this week and week after next
              expect(daysDiff2).toBe(14);
              
              // This week's Friday should be the nearest Friday (0-6 days from current date)
              const daysFromCurrent = Math.abs(Math.round((normalizedThisWeek.getTime() - normalizedCurrentDate.getTime()) / (1000 * 60 * 60 * 24)));
              expect(daysFromCurrent).toBeLessThanOrEqual(6);
              
            } finally {
              // Restore original Date constructor
              global.Date = originalDate;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('formatDate', () => {
    it('should format date as MM.DD', () => {
      const date = new Date(2024, 11, 25); // December 25, 2024
      expect(formatDate(date)).toBe('12.25');
    });

    it('should pad single digits with zero', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024
      expect(formatDate(date)).toBe('01.05');
    });
  });

  describe('getFormattedFridayDate', () => {
    it('should return properly formatted strings for each week offset', () => {
      const thisWeek = getFormattedFridayDate(0);
      const nextWeek = getFormattedFridayDate(1);
      const weekAfter = getFormattedFridayDate(2);
      
      expect(thisWeek).toMatch(/^本周五：\d{2}\.\d{2}$/);
      expect(nextWeek).toMatch(/^下周五：\d{2}\.\d{2}$/);
      expect(weekAfter).toMatch(/^下下周五：\d{2}\.\d{2}$/);
    });
  });
});