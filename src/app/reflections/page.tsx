'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ReflectionEntry } from '@/types';
import { generateGratitudeMessages } from '@/ai/flows/generate-gratitude-messages';
import type { GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';
import { ReflectionInputForm } from '@/components/ReflectionInputForm';
import { ReflectionLog } from '@/components/ReflectionLog';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ReflectionCalendar } from '@/components/ReflectionCalendar';
import { useToast } from '@/hooks/use-toast';
import { getUniqueReflectionDates, calculateStreaks, convertDateStringsToDateObjects } from '@/lib/dateUtils';
import { saveReflectionToFirestore } from '@/lib/firestoreService';
import { useUser, useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { NewReflectionDialog } from '@/components/NewReflectionDialog';
import { AppLayout } from '@/components/AppLayout';
import { AdMobBannerPlaceholder } from '@/components/ads/AdMobBannerPlaceholder';

const LATEST_ENTRIES_COUNT = 5;

function ReflectionsPageContent() {
    const { data: user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    // Firestore query for all reflections to calculate streaks
    const allReflectionsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/reflections`),
            orderBy('timestamp', 'desc')
        );
    }, [user, firestore]);

    // Firestore query for the most recent reflections to display in the log
    const latestReflectionsQuery = useMemo(() => {
        if (!allReflectionsQuery) return null;
        return query(allReflectionsQuery, firestoreLimit(LATEST_ENTRIES_COUNT));
    }, [allReflectionsQuery]);

    const { data: allReflections = [], isLoading: isLoadingAll } = useCollection<ReflectionEntry>(allReflectionsQuery);
    const { data: latestReflections = [], isLoading: isLoadingLatest } = useCollection<ReflectionEntry>(latestReflectionsQuery);

    const [isGenerating, setIsGenerating] = useState(false);
    const [newReflectionToShow, setNewReflectionToShow] = useState<{ reflectionText: string; aiAssistance: GenerateGratitudeMessagesOutput } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { toast } = useToast();

    // Memoize date calculations for performance
    const uniqueDatesSet = useMemo(() => getUniqueReflectionDates(allReflections), [allReflections]);
    const { currentStreak, longestStreak } = useMemo(() => calculateStreaks(uniqueDatesSet), [uniqueDatesSet]);
    const calendarDates = useMemo(() => convertDateStringsToDateObjects(uniqueDatesSet), [uniqueDatesSet]);

    const handleAddReflection = async (reflectionText: string) => {
        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to save a reflection.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        try {
            const aiResponse = await generateGratitudeMessages({ dailyReflection: reflectionText });
            
            await saveReflectionToFirestore(firestore, user.uid, {
                reflectionText: reflectionText,
                aiAssistance: aiResponse,
            });

            setNewReflectionToShow({ reflectionText, aiAssistance: aiResponse });
            setIsDialogOpen(true);

            toast({
                title: "Reflection Saved!",
                description: "Your AI-powered insights are ready.",
            });

        } catch (error: any) {
            console.error("Error generating or saving reflection:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message || "Could not save reflection or generate insights.",
            });
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-4 md:p-8">
            {/* Main Content */}
            <main className="xl:col-span-2">
                <ReflectionInputForm onSubmit={handleAddReflection} isLoading={isGenerating} />
                <ReflectionLog entries={latestReflections} />
            </main>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-8">
                <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />
                <ReflectionCalendar reflectionDates={calendarDates} />
                {process.env.NEXT_PUBLIC_ADMOB_BANNER_ID && (
                    <AdMobBannerPlaceholder adUnitId={process.env.NEXT_PUBLIC_ADMOB_BANNER_ID} />
                )}
            </aside>

            {/* AI Results Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary flex items-center">
                            Your AI-Powered Reflection
                        </DialogTitle>
                        <DialogDescription>
                            Here are the insights our AI has discovered from your words.
                        </DialogDescription>
                    </DialogHeader>
                    {newReflectionToShow && (
                        <NewReflectionDialog
                            reflectionText={newReflectionToShow.reflectionText}
                            aiAssistance={newReflectionToShow.aiAssistance}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ReflectionsPage() {
    return (
        <AppLayout>
            <ReflectionsPageContent />
        </AppLayout>
    )
}
