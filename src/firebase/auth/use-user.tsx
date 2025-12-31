
'use client';

import { useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '../provider';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const USER_QUERY_KEY = ['firebase-user'];

export function useUser() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      queryClient.setQueryData(USER_QUERY_KEY, firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, queryClient]);

  const { data, error } = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: () => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          unsubscribe();
          resolve(firebaseUser);
        });
      });
    },
    initialData: user,
    staleTime: Infinity,
  });

  const handleSignOut = async () => {
    await signOut(auth);
    queryClient.setQueryData(USER_QUERY_KEY, null);
  };
  
  return { data, loading, error, signOut: handleSignOut };
}
