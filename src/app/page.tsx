
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ReflectionEntry } from '@/types';
import { generateGratitudeMessages } from '@/ai/flows/generate-gratitude-messages';
import type { GenerateGratitudeMessagesInput, GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';
import { GratitudeFlowHeader } from '@/components/GratitudeFlowHeader';
import { ReflectionInputForm } from '@/components/ReflectionInputForm';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromStorage, saveReflectionsToStorage } from '@/lib/localStorage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ReflectionCalendar } from '@/components/ReflectionCalendar';
import { getUniqueReflectionDates, calculateStreaks, convertDateStringsToDateObjects } from '@/lib/dateUtils';

const MAX_RECENT_ENTRIES_ON_MAIN_PAGE = 3;

export default function GratitudeFlowPage() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadedReflections = getReflectionsFromStorage();
    setReflections(loadedReflections);
  }, []);

  useEffect(() => {
    saveReflectionsToStorage(reflections);
  }, [reflections]);

  const handleAddReflection = async (reflectionText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const aiInput: GenerateGratitudeMessagesInput = { dailyReflection: reflectionText };
      const aiOutput: GenerateGratitudeMessagesOutput = await generateGratitudeMessages(aiInput);

      const newEntry: ReflectionEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        reflectionText,
        aiAssistance: aiOutput,
      };
      setReflections(prevEntries => [newEntry, ...prevEntries]);
    } catch (e: any) {
      console.error('Error generating gratitude message:', e);
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const recentReflections = reflections.slice(0, MAX_RECENT_ENTRIES_ON_MAIN_PAGE);

  const { uniqueDatesSet, streaks, calendarDates } = useMemo(() => {
    const uniqueDates = getUniqueReflectionDates(reflections);
    const calculatedStreaks = calculateStreaks(uniqueDates);
    const datesForCalendar = convertDateStringsToDateObjects(uniqueDates);
    return { uniqueDatesSet: uniqueDates, streaks: calculatedStreaks, calendarDates: datesForCalendar };
  }, [reflections]);


  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-2xl space-y-8">
        <GratitudeFlowHeader />

        <StreakDisplay currentStreak={streaks.currentStreak} longestStreak={streaks.longestStreak} />

        <ReflectionInputForm onSubmit={handleAddReflection} isLoading={isLoading} />

        {error && (
          <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button variant="link" onClick={() => setError(null)} className="p-0 h-auto ml-2 text-destructive-foreground hover:text-destructive-foreground/80">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <ReflectionCalendar reflectionDates={calendarDates} />

        <ReflectionLog entries={recentReflections} />

        {reflections.length > MAX_RECENT_ENTRIES_ON_MAIN_PAGE && (
          <div className="mt-6 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/history">
                <BookOpen className="mr-2 h-5 w-5" />
                View Full Gratitude Journey
              </Link>
            </Button>
          </div>
        )}
        
        <footer className="mt-12 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} GratitudeFlow. Cultivate positivity, one reflection at a time.</p>
        </footer>
      </div>
    </div>
  );
}
