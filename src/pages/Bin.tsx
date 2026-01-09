import { useMemo } from 'react';
import { getCurrentBinSchedule } from '../utils/binSchedule';
import publicHolidaysData from '../data/publicHolidays.json';
import { Link } from 'react-router-dom';

function Bin() {
  // Load and parse public holidays with error handling
  const publicHolidays = useMemo(() => {
    const holidays: Date[] = [];
    
    try {
      // Check if data exists
      if (!publicHolidaysData || typeof publicHolidaysData !== 'object') {
        console.warn('Public holidays data is missing or malformed. Defaulting to no holidays.');
        return holidays;
      }
      
      // Convert all holiday strings to Date objects
      Object.values(publicHolidaysData).forEach((yearHolidays) => {
        if (Array.isArray(yearHolidays)) {
          yearHolidays.forEach((dateStr: string) => {
            try {
              const date = new Date(dateStr);
              // Validate the date is valid
              if (!isNaN(date.getTime())) {
                holidays.push(date);
              } else {
                console.warn(`Invalid date string in public holidays: ${dateStr}`);
              }
            } catch (error) {
              console.warn(`Error parsing holiday date: ${dateStr}`, error);
            }
          });
        }
      });
    } catch (error) {
      console.warn('Error loading public holidays data. Defaulting to no holidays.', error);
    }
    
    return holidays;
  }, []);

  // Get current bin schedule
  const scheduleInfo = useMemo(() => {
    return getCurrentBinSchedule(new Date(), publicHolidays);
  }, [publicHolidays]);

  // Format collection day
  const collectionDayName = scheduleInfo.collectionDay.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Determine bin color classes
  const binColorClass = scheduleInfo.binType === 'green' 
    ? 'bg-green-600 text-white' 
    : 'bg-yellow-400 text-gray-900';

  const binLabel = scheduleInfo.binType === 'green' ? 'Green Bin' : 'Recycle Bin';

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-(--color-primary) mb-8">
          Bin Collection Schedule
        </h1>

        {/* Bin Type Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">This Week's Bin:</h2>
          <div className={`${binColorClass} p-6 rounded-lg text-center`}>
            <p className="text-3xl font-bold">{binLabel}</p>
          </div>
        </div>

        {/* Collection Day Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Collection Day:</h2>
          <div className="bg-(--color-primary) text-white p-6 rounded-lg">
            <p className="text-xl font-semibold">{collectionDayName}</p>
          </div>
        </div>

        {/* Holiday Warning */}
        {scheduleInfo.isHolidayAffected && scheduleInfo.holidayMessage && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg 
                  className="h-5 w-5 text-orange-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold">Public Holiday Notice</p>
                <p className="mt-1">{scheduleInfo.holidayMessage}</p>
              </div>
            </div>
          </div>
        )}
        <Link 
          to="/" 
          className="inline-block px-6 py-3 border-2 border-solid border-(--color-primary) text-(--color-primary) rounded-lg hover:opacity-90 transition-opacity"
        >
          ← Back
        </Link>
      </div>

    </div>
  );
}

export default Bin;
