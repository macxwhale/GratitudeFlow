
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
  if (!userId) {
    console.error("saveReflectionToFirestore: No userId provided.");
    return null;
  }
  try {
    const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
    const newReflectionData = {
      ...entry,
      timestamp: Timestamp.now(), // Use Firestore Timestamp for consistent server-side time
    };
    console.log(`Attempting to save reflection for user ${userId} to path ${reflectionsPath} with data:`, newReflectionData);
    const docRef = await addDoc(collection(db, reflectionsPath), newReflectionData);
    
    // Construct the full entry to return, matching the ReflectionEntry type
    return {
      id: docRef.id,
      timestamp: (newReflectionData.timestamp as Timestamp).toDate().toISOString(),
      reflectionText: newReflectionData.reflectionText,
      aiAssistance: newReflectionData.aiAssistance,
    };
  } catch (error: any) {
    console.error("Error saving reflection to Firestore. UserID:", userId);
    console.error("Firebase Error Code:", error.code); // Log specific Firebase error code if available
    console.error("Firebase Error Message:", error.message); // Log specific Firebase error message
    console.error("Full Firebase Error Object:", error); // Log the full error object for more details
    return null;
  }
}

// Potentially, a function to migrate local storage to Firestore if needed in the future
export async function migrateLocalStorageToFirestore(userId: string, localReflections: ReflectionEntry[]): Promise<void> {
  if (!userId || !localReflections || localReflections.length === 0) return;

  const reflectionsPath = `users/${userId}/${REFLECTIONS_COLLECTION}`;
  const batch = writeBatch(db);

  localReflections.forEach(entry => {
    const firestoreEntryData = {
      reflectionText: entry.reflectionText,
      aiAssistance: entry.aiAssistance,
      timestamp: Timestamp.fromDate(new Date(entry.timestamp)),
    };
    const newDocRef = doc(collection(db, reflectionsPath));
    batch.set(newDocRef, firestoreEntryData);
  });

  try {
    await batch.commit();
    console.log(`Migrated ${localReflections.length} entries to Firestore for user ${userId}.`);
  } catch (error) {
    console.error("Error migrating local storage to Firestore:", error);
  }
}
