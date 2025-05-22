import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';
import { BookOpenText, HeartHandshake, MessageSquareText } from 'lucide-react';

interface ReflectionEntryCardProps {
  entry: ReflectionEntry;
}

export function ReflectionEntryCard({ entry }: ReflectionEntryCardProps) {
  const formattedTimestamp = format(parseISO(entry.timestamp), "MMMM d, yyyy 'at' h:mm a");

  return (
    <Card className="mb-6 shadow-lg overflow-hidden bg-card/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-3">
        <CardDescription className="text-sm text-muted-foreground">{formattedTimestamp}</CardDescription>
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          <MessageSquareText className="w-5 h-5 mr-2 shrink-0" />
          Your Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{entry.reflectionText}</p>
        <Separator className="my-4" />
        <div>
          <h3 className="text-lg font-semibold text-accent flex items-center mb-2">
            <HeartHandshake className="w-5 h-5 mr-2 shrink-0" />
            A Moment of Gratitude
          </h3>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{entry.gratitudeMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
}
