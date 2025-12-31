
import type { Firestore } from 'firebase/firestore';
import type { ReflectionEntry } from '@/types';
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
  writeBatch,
  doc,
} from 'firebase/firestore';

const REFLECTIONS_COLLECTION = 'reflections'; // Per user, so path will be users/{userId}/reflections

// Save a new reflection for a user
export async function saveReflectionToFirestore(firestore: Firestore, userId: string, entry: Omit<ReflectionEntry, 'id' | 'timestamp'>): Promise<string> {
  if (!userId) {
    throw new Error("saveReflectionToFirestore: No userId provided.");
  }
  
  const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
  const newReflectionData = {
    ...entry,
    timestamp: Timestamp.now(), // Use Firestore Timestamp for consistent server-side time
  };

  try {
    const docRef = await addDoc(collection(firestore, reflectionsPath), newReflectionData);
    return docRef.id;
  } catch (error: any) {
    console.error("Error saving reflection to Firestore. UserID:", userId, error);
    throw new Error("Failed to save your reflection. Please try again.");
  }
}

// Potentially, a function to migrate local storage to Firestore if needed in the future
export async function migrateLocalStorageToFirestore(firestore: Firestore, userId: string, localReflections: ReflectionEntry[]): Promise<void> {
  if (!userId || !localReflections || localReflections.length === 0) return;

  const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
  const batch = writeBatch(firestore);

  localReflections.forEach(entry => {
    const firestoreEntryData = {
      reflectionText: entry.reflectionText,
      aiAssistance: entry.aiAssistance,
      timestamp: Timestamp.fromDate(new Date(entry.timestamp)),
    };
    const newDocRef = doc(collection(firestore, reflectionsPath));
    batch.set(newDocRef, firestoreEntryData);
  });

  try {
    await batch.commit();
    console.log(`Migrated ${localReflections.length} entries to Firestore for user ${userId}.`);
  } catch (error) {
    console.error("Error migrating local storage to Firestore:", error);
  }
}

// This function is no longer needed as we are using useCollection hook for real-time updates.
// Keeping it here for reference or future batch operations if necessary.
export async function getReflectionsFromFirestore(firestore: Firestore, userId: string): Promise<ReflectionEntry[]> {
  if (!userId) return [];
  try {
    const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
    const q = query(collection(firestore, reflectionsPath), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        // Ensure timestamp is string (ISO format) as expected by ReflectionEntry type
        timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        reflectionText: data.reflectionText || '',
        aiAssistance: data.aiAssistance || { identifiedEmotionalStates: [], personalizedMessages: [], affirmation: "" },
      } as ReflectionEntry;
    });
  } catch (error) {
    console.error("Error fetching reflections from Firestore:", error);
    return [];
  }
}
