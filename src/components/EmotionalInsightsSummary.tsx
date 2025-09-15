
'use client';

import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Tag } from 'lucide-react';
import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { format, parseISO } from 'date-fns';

interface EmotionalInsightsSummaryProps {
  entries: ReflectionEntry[];
  maxThemesToShow?: number;
}

interface TimeSeriesDataPoint {
  date: string; // "MMM d"
  [theme: string]: number | string; // theme counts and date
}

export function EmotionalInsightsSummary({ entries, maxThemesToShow = 3 }: EmotionalInsightsSummaryProps) {
  const { chartData, topThemes, chartConfig } = useMemo(() => {
    if (entries.length < 2) {
      return { chartData: [], topThemes: [], chartConfig: {} };
    }
    
    const themesMap = new Map<string, number>();
    entries.forEach(entry => {
      entry.aiAssistance?.identifiedEmotionalStates?.forEach(state => {
        if (state.theme) {
          const normalizedTheme = state.theme.trim();
          themesMap.set(normalizedTheme, (themesMap.get(normalizedTheme) || 0) + 1);
        }
      });
    });

    const sortedThemes = Array.from(themesMap.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const topThemes = sortedThemes.slice(0, maxThemesToShow).map(([theme]) => theme);

    // Group entries by date and count themes
    const dataByDate = new Map<string, Record<string, number>>();
    [...entries].reverse().forEach(entry => { // Reverse to process from oldest to newest
      const date = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
      if (!dataByDate.has(date)) {
        dataByDate.set(date, {});
      }
      const dateEntry = dataByDate.get(date)!;

      entry.aiAssistance?.identifiedEmotionalStates?.forEach(state => {
        if (topThemes.includes(state.theme)) {
          dateEntry[state.theme] = (dateEntry[state.theme] || 0) + 1;
        }
      });
    });

    const chartData: TimeSeriesDataPoint[] = Array.from(dataByDate.entries()).map(([date, themeCounts]) => {
      const formattedDate = format(parseISO(date), 'MMM d');
      const dataPoint: TimeSeriesDataPoint = { date: formattedDate };
      topThemes.forEach(theme => {
        dataPoint[theme] = themeCounts[theme] || 0;
      });
      return dataPoint;
    });

    const dynamicChartConfig: any = {};
    topThemes.forEach((theme, index) => {
        dynamicChartConfig[theme] = {
            label: theme,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
    });

    return { chartData, topThemes, chartConfig: dynamicChartConfig };

  }, [entries, maxThemesToShow]);

  if (entries.length < 2) { // Line chart isn't useful for a single data point
    return (
      <Card className="mt-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold text-primary flex items-center justify-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Emotional Themes Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Continue your journey. More reflections are needed to visualize your emotional themes over time.
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
          Your Emotional Themes Over Time
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          How your most common emotional themes have appeared over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[250px] w-full">
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend verticalAlign="top" height={40}/>
              {topThemes.map(theme => (
                 <Line 
                    key={theme}
                    dataKey={theme} 
                    type="monotone" 
                    stroke={`var(--color-${theme})`}
                    strokeWidth={2}
                    dot={{
                      fill: `var(--color-${theme})`,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                 />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
