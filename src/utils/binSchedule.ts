// Bin schedule calculation utility

export type BinType = 'green' | 'recycle';

export interface BinScheduleInfo {
  binType: BinType;
  collectionDay: Date;
  isHolidayAffected: boolean;
  holidayMessage?: string;
}

// Constants
export const MELBOURNE_TIMEZONE = 'Australia/Melbourne';
export const BIN_SCHEDULE_START = new Date('2026-01-01T00:00:00+11:00'); // Week 1: Yellow bin (Jan 1-4, Melbourne time)
export const COLLECTION_DAY = 3; // Wednesday (0 = Sunday, 3 = Wednesday)

/**
 * Get current date in Melbourne timezone
 */
function getMelbourneDate(date?: Date): Date {
  const targetDate = date || new Date();
  // Convert to Melbourne time string and parse back to Date
  const melbourneString = targetDate.toLocaleString('en-AU', { 
    timeZone: MELBOURNE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Parse the Melbourne time string (format: "DD/MM/YYYY, HH:mm:ss")
  const [datePart, timePart] = melbourneString.split(', ');
  const [day, month, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');
  
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
}

/**
 * Calculate which week number we're in based on Monday-Sunday weeks
 * Week 1 starts on Jan 1, 2026
 * Uses Melbourne timezone for accurate week calculation
 */
function getWeeksSinceStart(currentDate: Date): number {
  const melbourneDate = getMelbourneDate(currentDate);
  const melbourneStart = getMelbourneDate(BIN_SCHEDULE_START);
  
  // Find the start of the week (Monday) for the current date
  // In JS: 0=Sunday, 1=Monday, ..., 6=Saturday
  const currentDay = melbourneDate.getDay();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Sunday is 6 days from Monday
  const startOfCurrentWeek = new Date(melbourneDate);
  startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - daysFromMonday);
  startOfCurrentWeek.setHours(0, 0, 0, 0);
  
  // Find the Monday on or before Jan 1, 2026
  // Jan 1, 2026 is Thursday, so the Monday before is Dec 29, 2025
  const startDay = melbourneStart.getDay();
  const daysFromStartMonday = startDay === 0 ? 6 : startDay - 1;
  const startOfFirstWeek = new Date(melbourneStart);
  startOfFirstWeek.setDate(startOfFirstWeek.getDate() - daysFromStartMonday);
  startOfFirstWeek.setHours(0, 0, 0, 0);
  
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const timeDiff = startOfCurrentWeek.getTime() - startOfFirstWeek.getTime();
  const weeks = Math.floor(timeDiff / msPerWeek) + 1; // +1 because we start counting from week 1
  
  return weeks < 1 ? 1 : weeks;
}

/**
 * Determine bin type based on week number
 * Odd weeks (1, 3, 5...) = recycle (yellow), even weeks (2, 4, 6...) = green
 */
function getBinTypeForWeek(weekNumber: number): BinType {
  return weekNumber % 2 === 1 ? 'recycle' : 'green';
}

/**
 * Find the next occurrence of a specific day of week from a given date
 * Uses Melbourne timezone
 */
function getNextDayOfWeek(fromDate: Date, targetDay: number): Date {
  const melbourneDate = getMelbourneDate(fromDate);
  const currentDay = melbourneDate.getDay();
  
  // Calculate days until target day
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7; // Move to next week if target day has passed
  }
  
  melbourneDate.setDate(melbourneDate.getDate() + daysUntil);
  return melbourneDate;
}

/**
 * Get the specific day of week for the current week (can be in the past)
 * Uses Melbourne timezone
 */
function getCurrentWeekDayOfWeek(fromDate: Date, targetDay: number): Date {
  const melbourneDate = getMelbourneDate(fromDate);
  const currentDay = melbourneDate.getDay();
  
  // Calculate days difference (can be negative for past days)
  const daysDiff = targetDay - currentDay;
  
  melbourneDate.setDate(melbourneDate.getDate() + daysDiff);
  return melbourneDate;
}

/**
 * Check if a date is a public holiday
 * Compares dates in Melbourne timezone
 */
function isPublicHoliday(date: Date, publicHolidays: Date[]): boolean {
  const melbourneDate = getMelbourneDate(date);
  const dateStr = melbourneDate.toISOString().split('T')[0];
  
  return publicHolidays.some(holiday => {
    const melbourneHoliday = getMelbourneDate(holiday);
    const holidayStr = melbourneHoliday.toISOString().split('T')[0];
    return holidayStr === dateStr;
  });
}

/**
 * Get the current bin schedule information
 * All calculations use Melbourne timezone
 */
export function getCurrentBinSchedule(
  currentDate: Date,
  publicHolidays: Date[] = []
): BinScheduleInfo {
  const melbourneDate = getMelbourneDate(currentDate);
  const melbourneStart = getMelbourneDate(BIN_SCHEDULE_START);
  
  // Handle dates before 2026 - default to green bin
  if (melbourneDate < melbourneStart) {
    const nextWednesday = getNextDayOfWeek(melbourneDate, COLLECTION_DAY);
    return {
      binType: 'green',
      collectionDay: nextWednesday,
      isHolidayAffected: false
    };
  }

  // Calculate which bin type for current week
  const weeksSinceStart = getWeeksSinceStart(melbourneDate);
  const binType = getBinTypeForWeek(weeksSinceStart);

  // Find next Wednesday
  const nextWednesday = getNextDayOfWeek(melbourneDate, COLLECTION_DAY);
  let isHolidayAffected = false;
  let holidayMessage: string | undefined;
  let collectionDay: Date;

  // Check if Wednesday is a public holiday
  if (isPublicHoliday(nextWednesday, publicHolidays)) {
    // Shift to Thursday
    collectionDay = new Date(nextWednesday);
    collectionDay.setDate(collectionDay.getDate() + 1);
    isHolidayAffected = true;
    holidayMessage = 'Collection day shifted to Thursday due to public holiday';
  } else {
    collectionDay = nextWednesday;
  }

  return {
    binType,
    collectionDay,
    isHolidayAffected,
    holidayMessage
  };
}

/**
 * Get the bin schedule for the current week (Wednesday can be in the past)
 * All calculations use Melbourne timezone
 */
export function getCurrentWeekBinSchedule(
  currentDate: Date,
  publicHolidays: Date[] = []
): BinScheduleInfo {
  const melbourneDate = getMelbourneDate(currentDate);
  const melbourneStart = getMelbourneDate(BIN_SCHEDULE_START);
  
  // Handle dates before 2026 - default to green bin
  if (melbourneDate < melbourneStart) {
    const thisWeekWednesday = getCurrentWeekDayOfWeek(melbourneDate, COLLECTION_DAY);
    return {
      binType: 'green',
      collectionDay: thisWeekWednesday,
      isHolidayAffected: false
    };
  }

  // Calculate which bin type for current week
  const weeksSinceStart = getWeeksSinceStart(melbourneDate);
  const binType = getBinTypeForWeek(weeksSinceStart);

  // Find this week's Wednesday (can be in the past)
  const thisWeekWednesday = getCurrentWeekDayOfWeek(melbourneDate, COLLECTION_DAY);
  let isHolidayAffected = false;
  let holidayMessage: string | undefined;
  let collectionDay: Date;

  // Check if Wednesday is a public holiday
  if (isPublicHoliday(thisWeekWednesday, publicHolidays)) {
    // Shift to Thursday
    collectionDay = new Date(thisWeekWednesday);
    collectionDay.setDate(collectionDay.getDate() + 1);
    isHolidayAffected = true;
    holidayMessage = 'Collection day shifted to Thursday due to public holiday';
  } else {
    collectionDay = thisWeekWednesday;
  }

  return {
    binType,
    collectionDay,
    isHolidayAffected,
    holidayMessage
  };
}
