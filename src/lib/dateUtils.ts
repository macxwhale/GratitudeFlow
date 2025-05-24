
import type { ReflectionEntry } from '@/types';
import { format, parseISO, differenceInCalendarDays, isToday, isYesterday, startOfDay, subDays } from 'date-fns';

/**
 * Gets a set of unique dates (YYYY-MM-DD) from reflection entries.
 */
export function getUniqueReflectionDates(reflections: ReflectionEntry[]): Set<string> {
  const dates = new Set<string>();
  reflections.forEach(entry => {
    try {
      const date = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
      dates.add(date);
    } catch (error) {
      console.error("Error parsing date from entry:", entry, error);
    }
  });
  return dates;
}

/**
 * Calculates current and longest streaks.
 * A day is considered part of a streak if a reflection exists for that calendar day.
 */
export function calculateStreaks(reflectionDatesSet: Set<string>): { currentStreak: number; longestStreak: number } {
  if (reflectionDatesSet.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert set to a sorted array of Date objects for easier processing
  const sortedDates = Array.from(reflectionDatesSet)
    .map(dateStr => startOfDay(parseISO(dateStr))) // Normalize to start of day for consistent comparison
    .sort((a, b) => a.getTime() - b.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let currentRun = 0;

  // Calculate Longest Streak
  if (sortedDates.length > 0) {
    currentRun = 1; // Start with the first date
    longestStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      if (differenceInCalendarDays(sortedDates[i], sortedDates[i-1]) === 1) {
        currentRun++;
      } else {
        currentRun = 1; // Reset run
      }
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    }
  }
  
  // Calculate Current Streak
  // Check from today, then yesterday, and so on.
  const today = startOfDay(new Date());
  let streakDate = today;
  
  // If no reflection today, check if the last reflection was yesterday to start the streak count.
  // Otherwise, the current streak is 0 unless there's a reflection today.
  if (reflectionDatesSet.has(format(streakDate, 'yyyy-MM-dd'))) {
    currentStreak = 1;
    let prevDate = subDays(streakDate, 1);
    while (reflectionDatesSet.has(format(prevDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      prevDate = subDays(prevDate, 1);
    }
  } else {
    // No reflection today, check if streak ended yesterday
    streakDate = subDays(today, 1);
    if (reflectionDatesSet.has(format(streakDate, 'yyyy-MM-dd'))) {
       currentStreak = 1; // Start with yesterday
       let prevDate = subDays(streakDate, 1);
       while (reflectionDatesSet.has(format(prevDate, 'yyyy-MM-dd'))) {
         currentStreak++;
         prevDate = subDays(prevDate, 1);
       }
    } else {
      currentStreak = 0; // No reflection today or yesterday
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Converts a Set of "YYYY-MM-DD" strings to an array of Date objects.
 */
export function convertDateStringsToDateObjects(dateStrings: Set<string>): Date[] {
  return Array.from(dateStrings).map(dateStr => {
    try {
      return parseISO(dateStr);
    } catch (error) {
      console.error("Error parsing date string for calendar:", dateStr, error);
      return null; // Should be filtered out
    }
  }).filter(date => date !== null) as Date[];
}

