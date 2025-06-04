
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

// Configure emulators if in development and specific env vars are set
if (process.env.NODE_ENV === 'development') {
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    // Default emulator ports. Adjust if your config is different.
    // Check if emulators are already connected to prevent re-connecting on HMR
    // This is a basic check; more robust checks might be needed in complex setups
    if (!(auth as any).emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    if (!(db as any).emulatorConfig) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    console.log('Firebase emulators connected: Auth (9099), Firestore (8080)');
  }
}


export { app, auth, db };
