
import { db } from '@/lib/firebase';
import type { ReflectionEntry } from '@/types';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

const REFLECTIONS_COLLECTION = 'reflections'; // Per user, so path will be users/{userId}/reflections

// Get reflections for a user
export async function getReflectionsFromFirestore(userId: string): Promise<ReflectionEntry[]> {
  if (!userId) return [];
  try {
    const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
    const q = query(collection(db, reflectionsPath), orderBy('timestamp', 'desc'));
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

// Save a new reflection for a user
export async function saveReflectionToFirestore(userId: string, entry: Omit<ReflectionEntry, 'id' | 'timestamp'>): Promise<ReflectionEntry | null> {
  if (!userId) return null;
  try {
    const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
    const newReflectionData = {
      ...entry,
      timestamp: Timestamp.now(), // Use Firestore Timestamp for consistent server-side time
    };
    const docRef = await addDoc(collection(db, reflectionsPath), newReflectionData);
    
    // Construct the full entry to return, matching the ReflectionEntry type
    return {
      id: docRef.id,
      timestamp: (newReflectionData.timestamp as Timestamp).toDate().toISOString(),
      reflectionText: newReflectionData.reflectionText,
      aiAssistance: newReflectionData.aiAssistance,
    };
  } catch (error) {
    console.error("Error saving reflection to Firestore:", error);
    return null;
  }
}

// Potentially, a function to migrate local storage to Firestore if needed in the future
export async function migrateLocalStorageToFirestore(userId: string, localReflections: ReflectionEntry[]): Promise<void> {
  if (!userId || !localReflections || localReflections.length === 0) return;

  const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
  const batch = writeBatch(db);

  // Check existing reflections to avoid duplicates (optional, depends on desired behavior)
  // For simplicity, this example assumes we're just adding them if they aren't already there by some ID.
  // A more robust migration might check timestamps or content.

  localReflections.forEach(entry => {
    // Firestore uses auto-generated IDs, so we don't reuse local storage IDs directly as doc IDs unless they are truly unique
    // For this migration, we'll let Firestore generate new IDs for simplicity.
    // If local entry.id was significant and unique, you might use setDoc(doc(db, reflectionsPath, entry.id), data)
    
    const firestoreEntryData = {
      reflectionText: entry.reflectionText,
      aiAssistance: entry.aiAssistance,
      // Convert ISO string timestamp back to Firestore Timestamp
      timestamp: Timestamp.fromDate(new Date(entry.timestamp)),
    };
    // Create a new doc for each local entry
    const newDocRef = doc(collection(db, reflectionsPath));
    batch.set(newDocRef, firestoreEntryData);
  });

  try {
    await batch.commit();
    console.log(`Migrated ${localReflections.length} entries to Firestore for user ${userId}.`);
    // Optionally clear local storage after successful migration
    // localStorage.removeItem('gratitudeFlowReflections');
  } catch (error) {
    console.error("Error migrating local storage to Firestore:", error);
  }
}
