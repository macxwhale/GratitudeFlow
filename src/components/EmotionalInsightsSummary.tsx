
'use client';

import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Tag } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface EmotionalInsightsSummaryProps {
  entries: ReflectionEntry[];
  maxThemesToShow?: number;
}

interface ThemeFrequency {
  theme: string;
  count: number;
}

export function EmotionalInsightsSummary({ entries, maxThemesToShow = 5 }: EmotionalInsightsSummaryProps) {
  const themeFrequencies = useMemo(() => {
    const themesMap = new Map<string, number>();
    entries.forEach(entry => {
      entry.aiAssistance?.identifiedEmotionalStates?.forEach(state => {
        if (state.theme) {
          // Normalize theme names for better grouping (e.g., lowercase)
          const normalizedTheme = state.theme.trim();
          themesMap.set(normalizedTheme, (themesMap.get(normalizedTheme) || 0) + 1);
        }
      });
    });

    return Array.from(themesMap.entries())
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxThemesToShow);
  }, [entries, maxThemesToShow]);

  if (entries.length === 0 || themeFrequencies.length === 0) {
    return (
      <Card className="mt-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold text-primary flex items-center justify-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Emotional Themes Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            As you add more reflections, your emotional themes will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    count: {
      label: 'Count',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card className="mt-8 shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-center font-semibold text-primary flex items-center justify-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Your Recurring Emotional Themes
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          A visual summary of the most common themes from your reflections.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {themeFrequencies.length > 0 ? (
          <>
            <div className="h-[200px] w-full">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={themeFrequencies} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="theme"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
                  />
                   <YAxis
                    dataKey="count"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            <ul className="space-y-3">
              {themeFrequencies.map(({ theme, count }) => (
                <li key={theme} className="flex justify-between items-center p-3 bg-muted/30 rounded-md border border-border">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-accent shrink-0" />
                    <span className="font-medium text-foreground">{theme}</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Seen {count} time{count > 1 ? 's' : ''}
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            No recurring emotional themes identified yet. Keep reflecting!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
