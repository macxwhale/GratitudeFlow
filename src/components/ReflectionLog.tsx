import type { ReflectionEntry } from '@/types';
import { ReflectionEntryCard } from './ReflectionEntryCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Smile } from 'lucide-react';

interface ReflectionLogProps {
  entries: ReflectionEntry[];
}

export function ReflectionLog({ entries }: ReflectionLogProps) {
  if (entries.length === 0) {
    return (
      <div className="mt-10 text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/50">
        <Smile className="mx-auto h-16 w-16 text-muted-foreground/70 mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">Your Gratitude Journey Awaits</h3>
        <p className="mt-2 text-muted-foreground">
          Start by sharing your reflections above. Each entry will appear here, helping you track your path to positivity.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-primary text-center">My Gratitude Journey</h2>
      <ScrollArea className="h-auto"> {/* Adjust height as needed or let it grow */}
        <div className="space-y-6">
          {entries.map((entry) => (
            <ReflectionEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
