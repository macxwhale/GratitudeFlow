
'use client';

import { useState, useEffect } from 'react';
import type { ReflectionEntry } from '@/types';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromStorage } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ArrowDownCircle, ScrollText } from 'lucide-react';

const ITEMS_TO_LOAD = 5;
const INITIAL_ITEMS = 5;

export default function HistoryPage() {
  const [allReflections, setAllReflections] = useState<ReflectionEntry[]>([]);
  const [visibleEntriesCount, setVisibleEntriesCount] = useState(INITIAL_ITEMS);

  useEffect(() => {
    setAllReflections(getReflectionsFromStorage());
  }, []);

  const visibleEntries = allReflections.slice(0, visibleEntriesCount);

  const loadMoreReflections = () => {
    setVisibleEntriesCount(prevCount => prevCount + ITEMS_TO_LOAD);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-2xl">
        <header className="py-8 text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <ScrollText className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              My Full Gratitude Journey
            </h1>
            <p className="text-lg text-muted-foreground px-4">
              Revisit your reflections and trace your path to positivity through time.
            </p>
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
          {/* Optional: Keep the second back button or remove if header one is sufficient */}
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
