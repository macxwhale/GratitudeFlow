import type { GenerateGratitudeMessagesOutput } from '@/ai/flows/generate-gratitude-messages';
import type { Timestamp } from 'firebase/firestore';

export interface ReflectionEntry {
  id: string;
  timestamp: Timestamp | string; // Allow both for data from firestore and local state
  reflectionText: string;
  aiAssistance: GenerateGratitudeMessagesOutput;
}
