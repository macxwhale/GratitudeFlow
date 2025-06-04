
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReflectionEntry } from '@/types';
import { generateGratitudeMessages } from '@/ai/flows/generate-gratitude-messages';
import type { GenerateGratitudeMessagesInput, GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';
import { GratitudeFlowHeader } from '@/components/GratitudeFlowHeader';
import { ReflectionInputForm } from '@/components/ReflectionInputForm';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromFirestore, saveReflectionToFirestore, migrateLocalStorageToFirestore } from '@/lib/firestoreService';
import { getReflectionsFromStorage as getReflectionsFromLocalStorage, saveReflectionsToStorage as saveReflectionsToLocalStorage } from '@/lib/localStorage'; // Keep for potential migration
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, BookOpen, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ReflectionCalendar } from '@/components/ReflectionCalendar';
import { getUniqueReflectionDates, calculateStreaks, convertDateStringsToDateObjects } from '@/lib/dateUtils';
import { AdSlot } from '@/components/ads/AdSlot';
import { AdMobBannerPlaceholder } from '@/components/ads/AdMobBannerPlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const MAX_RECENT_ENTRIES_ON_MAIN_PAGE = 3;

export default function GratitudeFlowPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For AI generation
  const [isFetchingData, setIsFetchingData] = useState(true); // For fetching reflections
  const [error, setError] = useState<string | null>(null);

  const attemptMigration = useCallback(async (userId: string) => {
    const localReflections = getReflectionsFromLocalStorage();
    if (localReflections.length > 0) {
      console.log("Found local reflections, attempting migration...");
      await migrateLocalStorageToFirestore(userId, localReflections);
      saveReflectionsToLocalStorage([]); 
      console.log("Local storage cleared after migration attempt.");
    }
  }, []);

  useEffect(() => {
    if (authLoading) return; 

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setIsFetchingData(true);
      setError(null); // Clear previous errors
      try {
        await attemptMigration(user.uid); 
        const firestoreReflections = await getReflectionsFromFirestore(user.uid);
        setReflections(firestoreReflections);
      } catch (err: any) {
        console.error("Error fetching page data:", err);
        setError(err.message || "Failed to load your journey. Please try refreshing the page.");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [user, authLoading, router, attemptMigration]);

  const handleAddReflection = async (reflectionText: string) => {
    if (!user) {
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
      const savedEntry = await saveReflectionToFirestore(user.uid, newEntryData);
      if (savedEntry) {
        setReflections(prevEntries => [savedEntry, ...prevEntries]);
      } else {
        throw new Error("Failed to save reflection to the database.");
      }
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
  const admobAdUnitId = process.env.NEXT_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || "YOUR_ADMOB_BANNER_AD_UNIT_ID_HERE";

  if (authLoading || isFetchingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your journey...</p>
      </div>
    );
  }
  
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <p className="mt-4 text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-between items-center">
          <GratitudeFlowHeader />
          <Button variant="outline" onClick={signOut} disabled={isLoading || isFetchingData}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
        

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

        <div className="my-6">
          <p className="text-center text-xs text-muted-foreground mb-1">Advertisement (Web - AdSense)</p>
          <AdSlot adSlotId={adsenseAdSlotId} />
        </div>

        <div className="my-6">
           <p className="text-center text-xs text-muted-foreground mb-1">Advertisement (Mobile App - AdMob Placeholder)</p>
          <AdMobBannerPlaceholder adUnitId={admobAdUnitId} />
        </div>

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
