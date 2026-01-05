/**
 * Date calculation utilities for the price calculator
 * Handles Friday date calculations and date formatting
 */

/**
 * Calculate the Friday date for a specified week offset
 * @param weekOffset - Number of weeks from current week (0=this week, 1=next week, 2=week after next)
 * @returns Date object representing the Friday of the specified week
 */
export function getFridayDate(weekOffset: number): Date {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday
  
  // Calculate days until next Friday (or today if it's Friday)
  // If today is Friday (5), daysUntilFriday = 0
  // If today is Saturday (6), daysUntilFriday = 6 (next Friday)
  // If today is Sunday (0), daysUntilFriday = 5
  const daysUntilFriday = currentDay <= 5 ? (5 - currentDay) : (7 - currentDay + 5);
  
  // Calculate the target Friday
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilFriday + (weekOffset * 7));
  
  return targetDate;
}

/**
 * Format a date for display in the application
 * @param date - Date object to format
 * @returns Formatted date string in MM.DD format
 */
export function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}.${day}`;
}

/**
 * Get formatted Friday date string for display
 * @param weekOffset - Number of weeks from current week
 * @returns Formatted date string with appropriate prefix
 */
export function getFormattedFridayDate(weekOffset: number): string {
  const fridayDate = getFridayDate(weekOffset);
  const formattedDate = formatDate(fridayDate);
  
  switch (weekOffset) {
    case 0:
      return `本周五：${formattedDate}`;
    case 1:
      return `下周五：${formattedDate}`;
    case 2:
      return `下下周五：${formattedDate}`;
    default:
      return `周五：${formattedDate}`;
  }
}