
'use client';

import { Flame, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <Card className="shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center font-semibold text-primary">Reflection Streaks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-center text-center py-2">
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/30 min-w-[120px]">
            <Flame className="w-10 h-10 text-accent mb-1" />
            <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/30 min-w-[120px]">
            <Trophy className="w-10 h-10 text-accent mb-1" />
            <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
