
'use client';

import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Tag } from 'lucide-react';
import { useMemo } from 'react';

interface EmotionalInsightsSummaryProps {
  entries: ReflectionEntry[];
  maxThemesToShow?: number;
}

export function EmotionalInsightsSummary({ entries, maxThemesToShow = 5 }: EmotionalInsightsSummaryProps) {
  const topThemes = useMemo(() => {
    const themesMap = new Map<string, number>();
    entries.forEach(entry => {
      entry.aiAssistance?.identifiedEmotionalStates?.forEach(state => {
        if (state.theme) {
          const normalizedTheme = state.theme.trim();
          themesMap.set(normalizedTheme, (themesMap.get(normalizedTheme) || 0) + 1);
        }
      });
    });

    return Array.from(themesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxThemesToShow);
  }, [entries, maxThemesToShow]);

  if (entries.length < 2) {
    return (
      <Card className="mt-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold text-primary flex items-center justify-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Emotional Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Continue your journey. More reflections are needed to identify emotional themes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-center font-semibold text-primary flex items-center justify-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Your Top Emotional Themes
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          The most common themes identified in your reflections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topThemes.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {topThemes.map(([theme, count]) => (
              <Badge key={theme} variant="secondary" className="py-1 px-3 text-sm">
                <Tag className="w-4 h-4 mr-2" />
                {theme}
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs font-bold text-primary-foreground">
                  {count}
                </span>
              </Badge>
            ))}
          </div>
        ) : (
           <p className="text-center text-muted-foreground">
            No specific emotional themes have been identified from your reflections yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
