import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { MessageSquareText, HeartHandshake, Tags, Quote, Lightbulb } from 'lucide-react';

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
          <Lightbulb className="w-5 h-5 mr-2 shrink-0" /> {/* Changed Icon */}
          Reflection & AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center mb-2">
            <MessageSquareText className="w-5 h-5 mr-2 shrink-0" />
            Your Words
          </h3>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{entry.reflectionText}</p>
        </div>
        
        {entry.aiAssistance.identifiedEmotionalStates && entry.aiAssistance.identifiedEmotionalStates.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-accent flex items-center mb-3">
                <Tags className="w-5 h-5 mr-2 shrink-0" />
                Emotional Landscape
              </h3>
              <div className="flex flex-wrap gap-2">
                {entry.aiAssistance.identifiedEmotionalStates.map((state, index) => (
                  <Badge key={index} variant="secondary" className="py-1 px-2.5">
                    <span className="font-medium">{state.theme}:</span>&nbsp;{state.description}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {entry.aiAssistance.personalizedMessages && entry.aiAssistance.personalizedMessages.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-accent flex items-center mb-3">
                <HeartHandshake className="w-5 h-5 mr-2 shrink-0" />
                Personalized Gratitude
              </h3>
              <div className="space-y-3">
                {entry.aiAssistance.personalizedMessages.map((msg, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-md border border-border shadow-sm">
                    <p className="font-semibold text-accent-foreground mb-1">{msg.title}</p>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {entry.aiAssistance.affirmation && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-accent flex items-center mb-2">
                <Quote className="w-5 h-5 mr-2 shrink-0 transform scale-x-[-1]" /> {/* Flipped Quote icon */}
                Affirmation for Alignment
              </h3>
              <blockquote className="italic text-foreground/90 leading-relaxed border-l-4 border-accent pl-3 py-1 bg-muted/20 rounded-r-md">
                {entry.aiAssistance.affirmation}
              </blockquote>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
