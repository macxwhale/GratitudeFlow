export interface ReflectionEntry {
  id: string;
  timestamp: string; // Store as ISO string for easier serialization
  reflectionText: string;
  gratitudeMessage: string;
}
