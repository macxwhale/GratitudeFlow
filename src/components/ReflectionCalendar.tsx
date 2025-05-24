
'use client';

import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import type { DayContentProps } from 'react-day-picker';

interface ReflectionCalendarProps {
  reflectionDates: Date[]; // Expecting an array of Date objects
}

export function ReflectionCalendar({ reflectionDates }: ReflectionCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const highlightedTimestamps = useMemo(() => {
    // Convert reflectionDates to a Set of timestamps (number) for efficient lookup.
    // Ensure dates are normalized to the start of the day in the local timezone.
    return new Set(reflectionDates.map(d => startOfDay(d).getTime()));
  }, [reflectionDates]);
  
  function CustomDayContent(props: DayContentProps) {
    const dayOfMonth = format(props.date, 'd');
    // Check if the current day in the calendar (props.date) has a reflection.
    const isReflectionDay = highlightedTimestamps.has(startOfDay(props.date).getTime());

    let dotColor = 'hsl(var(--primary))'; // Default dot color: Muted Coral

    if (props.activeModifiers.selected) {
      // If day is selected, background is primary. Dot should be primary-foreground (e.g., White).
      dotColor = 'hsl(var(--primary-foreground))';
    } else if (props.activeModifiers.today) {
      // If day is today (and not selected), background is accent. Dot should be accent-foreground.
      dotColor = 'hsl(var(--accent-foreground))';
    }
    // For other reflection days, dotColor remains 'hsl(var(--primary))', which contrasts well with default background.

    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {dayOfMonth}
        {isReflectionDay && (
          <div
            style={{
              position: 'absolute',
              bottom: '3px', // Position dot below the number
              width: '5px',
              height: '5px',
              backgroundColor: dotColor,
              borderRadius: '50%',
            }}
            data-testid="reflection-dot"
          />
        )}
      </div>
    );
  }

  return (
    <Card className="shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center font-semibold text-primary">My Reflection Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md p-0"
          components={{
            DayContent: CustomDayContent,
          }}
          // Modifiers for 'today' and 'selected' are handled by react-day-picker and ShadCN's default styles.
          // We don't need a 'highlighted' modifier style anymore as CustomDayContent handles the dot.
          disabled={(d) => d > new Date() || d < subDays(new Date(), 365*2)} // Disable future dates and dates older than 2 years
        />
      </CardContent>
    </Card>
  );
}

// Helper function to subtract days, add if not already available
function subDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - amount);
  return result;
}

