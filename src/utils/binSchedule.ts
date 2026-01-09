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
export const BIN_SCHEDULE_START = new Date('2026-01-01T00:00:00+11:00'); // Week 0: Green bin (Melbourne time)
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
 * Calculate weeks elapsed since the bin schedule start date
 * Uses Melbourne timezone for accurate week calculation
 */
function getWeeksSinceStart(currentDate: Date): number {
  const melbourneDate = getMelbourneDate(currentDate);
  const melbourneStart = getMelbourneDate(BIN_SCHEDULE_START);
  
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const timeDiff = melbourneDate.getTime() - melbourneStart.getTime();
  return Math.floor(timeDiff / msPerWeek);
}

/**
 * Determine bin type based on week parity
 * Even weeks = green, odd weeks = recycle
 */
function getBinTypeForWeek(weekNumber: number): BinType {
  return weekNumber % 2 === 0 ? 'green' : 'recycle';
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
