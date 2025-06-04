
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReflectionEntry } from '@/types';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromFirestore } from '@/lib/firestoreService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ArrowDownCircle, ScrollText, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ITEMS_TO_LOAD = 5; // No initial items concept here, always load some

export default function HistoryPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [allReflections, setAllReflections] = useState<ReflectionEntry[]>([]);
  // const [visibleEntriesCount, setVisibleEntriesCount] = useState(ITEMS_TO_LOAD); // We'll load all initially for simplicity, can paginate later if needed
  const [isFetchingData, setIsFetchingData] = useState(true);


  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setIsFetchingData(true);
      const firestoreReflections = await getReflectionsFromFirestore(user.uid);
      setAllReflections(firestoreReflections);
      setIsFetchingData(false);
    };

    fetchData();
  }, [user, authLoading, router]);

  // For now, showing all entries. "Load More" can be re-implemented if performance becomes an issue.
  const visibleEntries = allReflections;
  // const loadMoreReflections = () => {
  //   setVisibleEntriesCount(prevCount => Math.min(prevCount + ITEMS_TO_LOAD, allReflections.length));
  // };

  if (authLoading || isFetchingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your history...</p>
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
                 <Button variant="outline" onClick={signOut} className="ml-auto">
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

        <main className="mt-8">
          <ReflectionLog entries={visibleEntries} />
          {/* {visibleEntriesCount < allReflections.length && (
            <div className="mt-8 text-center">
              <Button onClick={loadMoreReflections} variant="secondary" size="lg">
                <ArrowDownCircle className="mr-2 h-5 w-5" /> Load More Reflections
              </Button>
            </div>
          )} */}
          {allReflections.length > 0 && /* visibleEntriesCount >= allReflections.length && */ (
            <p className="mt-8 text-center text-muted-foreground">You&apos;ve reached the end of your journey.</p>
          )}
        </main>

        <footer className="mt-12 py-6 text-center text-muted-foreground text-sm">
           {/* <div className="mb-4">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Reflections
              </Link>
            </Button>
          </div> */}
          <p>&copy; {new Date().getFullYear()} GratitudeFlow. Keep reflecting!</p>
        </footer>
      </div>
    </div>
  );
}
