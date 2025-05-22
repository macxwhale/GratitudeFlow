import type { ReflectionEntry } from '@/types';

const REFLECTIONS_KEY = 'gratitudeFlowReflections';

export function getReflectionsFromStorage(): ReflectionEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const items = window.localStorage.getItem(REFLECTIONS_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error reading reflections from local storage:", error);
    return [];
  }
}

export function saveReflectionsToStorage(reflections: ReflectionEntry[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
  } catch (error) {
    console.error("Error saving reflections to local storage:", error);
  }
}
