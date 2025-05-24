
'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { parseISO } from 'date-fns';

interface ReflectionCalendarProps {
  reflectionDates: Date[]; // Expecting an array of Date objects
}

export function ReflectionCalendar({ reflectionDates }: ReflectionCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const highlightedDays = useMemo(() => {
    return reflectionDates.map(d => parseISO(d.toISOString().split('T')[0])); // Normalize to start of day for react-day-picker
  }, [reflectionDates]);
  
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
          modifiers={{
            highlighted: highlightedDays,
          }}
          modifiersStyles={{
            highlighted: {
              border: "2px solid hsl(var(--accent))",
              borderRadius: '50%',
              color: "hsl(var(--accent-foreground))",
              backgroundColor: "hsl(var(--accent) / 0.3)",
            }
          }}
          disabled={(d) => d > new Date()} // Disable future dates
        />
      </CardContent>
    </Card>
  );
}
