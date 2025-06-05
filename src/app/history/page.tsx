
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReflectionEntry } from '@/types';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromFirestore } from '@/lib/firestoreService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ArrowDownCircle, ScrollText, LogOut, Loader2, Terminal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ITEMS_TO_LOAD = 5;

export default function HistoryPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [allReflections, setAllReflections] = useState<ReflectionEntry[]>([]);
  const [visibleEntriesCount, setVisibleEntriesCount] = useState(ITEMS_TO_LOAD);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false); // Ref to prevent re-entrant fetching


  useEffect(() => {
    if (authLoading) {
        setIsFetchingData(true);
        fetchingRef.current = false;
        return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (fetchingRef.current) return;

    const fetchData = async () => {
      fetchingRef.current = true;
      setIsFetchingData(true);
      setError(null);
      try {
        if (!user.uid) {
            throw new Error("User ID is not available for fetching history data.");
        }
        const firestoreReflections = await getReflectionsFromFirestore(user.uid);
        setAllReflections(firestoreReflections);
      } catch (err: any) {
        console.error("Error fetching history data:", err);
        setError(err.message || "Failed to load your history. Please try refreshing the page.");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const visibleEntries = allReflections.slice(0, visibleEntriesCount);
  const loadMoreReflections = () => {
    setVisibleEntriesCount(prevCount => Math.min(prevCount + ITEMS_TO_LOAD, allReflections.length));
  };

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
                 <Button variant="outline" onClick={signOut} className="ml-auto" disabled={isFetchingData}>
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
              {error}
              <Button variant="link" onClick={() => setError(null)} className="p-0 h-auto ml-2 text-destructive-foreground hover:text-destructive-foreground/80">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <main className="mt-8">
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
        </main>

        <footer className="mt-12 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} GratitudeFlow. Keep reflecting!</p>
        </footer>
      </div>
    </div>
  );
}
