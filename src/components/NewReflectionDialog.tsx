'use client';

import type { GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MessageSquareText, HeartHandshake, Tags, Quote } from 'lucide-react';

interface NewReflectionDialogProps {
  reflectionText: string;
  aiAssistance: GenerateGratitudeMessagesOutput;
}

export function NewReflectionDialog({ reflectionText, aiAssistance }: NewReflectionDialogProps) {
  const { identifiedEmotionalStates, personalizedMessages, affirmation } = aiAssistance;

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center mb-2">
          <MessageSquareText className="w-5 h-5 mr-2 shrink-0" />
          Your Words
        </h3>
        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap bg-muted/30 p-3 rounded-md border">
          {reflectionText}
        </p>
      </div>
      
      {identifiedEmotionalStates && identifiedEmotionalStates.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold text-accent flex items-center mb-3">
              <Tags className="w-5 h-5 mr-2 shrink-0" />
              Emotional Landscape
            </h3>
            <div className="flex flex-wrap gap-2">
              {identifiedEmotionalStates.map((state, index) => (
                <Badge key={index} variant="secondary" className="py-1 px-2.5 text-sm">
                  <span className="font-medium">{state.theme}:</span>&nbsp;{state.description}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {personalizedMessages && personalizedMessages.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold text-accent flex items-center mb-3">
              <HeartHandshake className="w-5 h-5 mr-2 shrink-0" />
              Personalized Gratitude
            </h3>
            <div className="space-y-3">
              {personalizedMessages.map((msg, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-md border shadow-sm">
                  <p className="font-semibold text-accent-foreground mb-1">{msg.title}</p>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {affirmation && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold text-accent flex items-center mb-2">
              <Quote className="w-5 h-5 mr-2 shrink-0 transform scale-x-[-1]" />
              Affirmation for Alignment
            </h3>
            <blockquote className="italic text-foreground leading-relaxed border-l-4 border-accent pl-4 py-2 bg-muted/40 rounded-r-md">
              {affirmation}
            </blockquote>
          </div>
        </>
      )}
    </div>
  );
}
