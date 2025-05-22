import type { GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';

export interface ReflectionEntry {
  id: string;
  timestamp: string; // Store as ISO string for easier serialization
  reflectionText: string;
  aiAssistance: GenerateGratitudeMessagesOutput; // Changed from gratitudeMessage: string
}
