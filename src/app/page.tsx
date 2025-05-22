'use client';

import { useState, useEffect } from 'react';
import type { ReflectionEntry } from '@/types';
import { generateGratitudeMessages } from '@/ai/flows/generate-gratitude-messages';
import type { GenerateGratitudeMessagesInput } from '@/ai/flows/generate-gratitude-messages';
import { GratitudeFlowHeader } from '@/components/GratitudeFlowHeader';
import { ReflectionInputForm } from '@/components/ReflectionInputForm';
import { ReflectionLog } from '@/components/ReflectionLog';
import { getReflectionsFromStorage, saveReflectionsToStorage } from '@/lib/localStorage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GratitudeFlowPage() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReflections(getReflectionsFromStorage());
  }, []);

  useEffect(() => {
    saveReflectionsToStorage(reflections);
  }, [reflections]);

  const handleAddReflection = async (reflectionText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const aiInput: GenerateGratitudeMessagesInput = { dailyReflection: reflectionText };
      // Explicitly type the promise if needed, though await should infer it
      const aiOutput = await generateGratitudeMessages(aiInput);

      const newEntry: ReflectionEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        reflectionText,
        gratitudeMessage: aiOutput.gratitudeMessage,
      };
      setReflections(prevEntries => [newEntry, ...prevEntries]);
    } catch (e: any) {
      console.error('Error generating gratitude message:', e);
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-2xl">
        <GratitudeFlowHeader />

        <main className="mt-8">
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

          <ReflectionLog entries={reflections} />
        </main>

        <footer className="mt-12 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} GratitudeFlow. Cultivate positivity, one reflection at a time.</p>
        </footer>
      </div>
    </div>
  );
}
