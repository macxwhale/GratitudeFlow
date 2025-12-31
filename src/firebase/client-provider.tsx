
'use client';
import { initializeFirebase } from './config';
import { FirebaseProvider } from './provider';

import type { ReactNode } from 'react';

let firebaseServices: any;

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  if (!firebaseServices) {
    firebaseServices = initializeFirebase();
  }

  return (
    <FirebaseProvider value={firebaseServices}>{children}</FirebaseProvider>
  );
}
