
'use client';

import { useState, useEffect } from 'react';
import type { ReflectionEntry } from '@/types';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromStorage } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ArrowDownCircle } from 'lucide-react';

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
        <header className="py-8 text-center">
          <div className="inline-flex items-center mb-4">
            <h1 className="text-4xl font-semibold tracking-tight text-primary">
              My Full Gratitude Journey
            </h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
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
            <p className="mt-8 text-center text-muted-foreground">You've reached the end of your journey.</p>
          )}
        </main>

        <footer className="mt-12 py-6 text-center text-muted-foreground text-sm">
          <div className="mb-4">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Reflections
              </Link>
            </Button>
          </div>
          <p>&copy; {new Date().getFullYear()} GratitudeFlow. Keep reflecting!</p>
        </footer>
      </div>
    </div>
  );
}
