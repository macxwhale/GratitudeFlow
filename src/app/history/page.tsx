
'use client';

import { useState, useMemo } from 'react';
import type { ReflectionEntry } from '@/types';
import { ReflectionLog } from '@/components/ReflectionLog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ArrowDownCircle, ScrollText, LogOut, Loader2, Terminal } from 'lucide-react';
import { useUser, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmotionalInsightsSummary } from '@/components/EmotionalInsightsSummary';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const ITEMS_TO_LOAD = 5;

export default function HistoryPage() {
  const { data: user, loading: authLoading, signOut } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const reflectionsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/reflections`),
      orderBy('timestamp', 'desc')
    );
  }, [user, firestore]);

  const { data: allReflections = [], isLoading: isFetchingData, error } = useCollection<ReflectionEntry>(reflectionsQuery);
  const [visibleEntriesCount, setVisibleEntriesCount] = useState(ITEMS_TO_LOAD);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your history...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
    router.push('/login');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <p className="mt-4 text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  const visibleEntries = allReflections.slice(0, visibleEntriesCount);
  const loadMoreReflections = () => {
    setVisibleEntriesCount(prevCount => Math.min(prevCount + ITEMS_TO_LOAD, allReflections.length));
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-2xl">
        <header className="py-8 text-center space-y-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1"></div> {/* Spacer */}
            <div className="flex flex-col items-center justify-center space-y-3 flex-1">
              <ScrollText className="w-12 h-12 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                My Full Gratitude Journey
              </h1>
              <p className="text-lg text-muted-foreground px-4">
                Revisit your reflections and trace your path to positivity through time.
              </p>
            </div>
            <div className="flex-1 flex justify-end">
                 <Button variant="outline" onClick={() => signOut().then(() => router.push('/login'))} className="ml-auto" disabled={isFetchingData}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </div>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Reflections
            </Link>
          </Button>
        </header>

        {error && (
          <Alert variant="destructive" className="my-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(error as any).message || "Failed to load history."}
            </AlertDescription>
          </Alert>
        )}

        <main className="mt-8">
          {isFetchingData && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          
          {!isFetchingData && allReflections.length > 0 && (
             <EmotionalInsightsSummary entries={allReflections} />
          )}

          <ReflectionLog entries={visibleEntries} />
          {visibleEntriesCount < allReflections.length && (
            <div className="mt-8 text-center">
              <Button onClick={loadMoreReflections} variant="secondary" size="lg">
                <ArrowDownCircle className="mr-2 h-5 w-5" /> Load More Reflections
              </Button>
            </div>
          )}
          {allReflections.length > 0 && visibleEntriesCount >= allReflections.length && (
            <p className="mt-8 text-center text-muted-foreground">You&apos;ve reached the end of your journey.</p>
          )}
           {allReflections.length === 0 && !isFetchingData && !error && (
            <div className="mt-10 text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/50">
                <p className="text-lg text-muted-foreground">No reflections found yet. Start your journey on the main page!</p>
            </div>
           )}
        </main>

        <footer className="mt-12 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} GratitudeFlow. Keep reflecting!</p>
        </footer>
      </div>
    </div>
  );
}
