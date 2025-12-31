'use client';

import { useState, useMemo } from 'react';
import type { ReflectionEntry } from '@/types';
import { generateGratitudeMessages } from '@/ai/flows/generate-gratitude-messages';
import type { GenerateGratitudeMessagesInput, GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';
import { GratitudeFlowHeader } from '@/components/GratitudeFlowHeader';
import { ReflectionInputForm } from '@/components/ReflectionInputForm';
import { ReflectionLog } from '@/components/ReflectionLog';
import { saveReflectionToFirestore } from '@/lib/firestoreService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ReflectionCalendar } from '@/components/ReflectionCalendar';
import { getUniqueReflectionDates, calculateStreaks, convertDateStringsToDateObjects } from '@/lib/dateUtils';
import { AdSlot } from '@/components/ads/AdSlot';
import { useUser, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { AppLayout } from '@/components/AppLayout';

const MAX_RECENT_ENTRIES_ON_MAIN_PAGE = 3;

function GratitudeFlowContent() {
  const { data: user } = useUser();
  const firestore = useFirestore();

  const reflectionsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/reflections`),
      orderBy('timestamp', 'desc')
    );
  }, [user, firestore]);

  const { data: reflections = [], isLoading: isFetchingData, error: firestoreError } = useCollection<ReflectionEntry>(reflectionsQuery);

  const [isLoading, setIsLoading] = useState(false); // For AI generation
  const [error, setError] = useState<string | null>(null);

  const handleAddReflection = async (reflectionText: string) => {
    if (!user || !firestore) {
      setError("You must be logged in to add reflections.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const aiInput: GenerateGratitudeMessagesInput = { dailyReflection: reflectionText };
      const aiOutput: GenerateGratitudeMessagesOutput = await generateGratitudeMessages(aiInput);

      const newEntryData = {
        reflectionText,
        aiAssistance: aiOutput,
      };
      await saveReflectionToFirestore(firestore, user.uid, newEntryData);
    } catch (e: any) {
      console.error('Error generating gratitude message or saving:', e);
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

  const adsenseAdSlotId = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ID_PAGE_BOTTOM || "YOUR_ADSENSE_AD_SLOT_ID_HERE";

  const displayError = error || (firestoreError as any)?.message;

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <GratitudeFlowHeader />
        
        <StreakDisplay currentStreak={streaks.currentStreak} longestStreak={streaks.longestStreak} />

        <ReflectionInputForm onSubmit={handleAddReflection} isLoading={isLoading} />

        {displayError && (
          <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {displayError}
              <Button variant="link" onClick={() => setError(null)} className="p-0 h-auto ml-2 text-destructive-foreground hover:text-destructive-foreground/80">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <ReflectionCalendar reflectionDates={calendarDates} />

        <div className="my-6">
          <AdSlot adSlotId={adsenseAdSlotId} />
        </div>
        
        {isFetchingData && <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />}

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


export default function GratitudeFlowPage() {
  return (
    <AppLayout>
      <GratitudeFlowContent />
    </AppLayout>
  );
}
