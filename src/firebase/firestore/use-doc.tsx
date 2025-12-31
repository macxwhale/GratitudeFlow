
'use client';

import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  onSnapshot,
  getDoc,
  type DocumentReference,
} from 'firebase/firestore';

import { useFirestore } from '../provider';

function getQueryKey<T>(ref: DocumentReference<T>) {
  return [ref.path];
}

export function useDoc<T>(
  ref: DocumentReference<T> | null,
): UseQueryResult<T, Error> {
  const firestore = useFirestore();
  const queryClient = useQueryClient();

  const queryKey = ref ? getQueryKey(ref) : null;

  return useQuery({
    queryKey: queryKey || ['empty-doc'],
    queryFn: async () => {
      if (!ref) {
        return null;
      }
      const snapshot = await getDoc(ref);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T : null;
    },
    enabled: !!ref,
    // Real-time updates
    useEffect: () => {
      if (!ref) {
        return;
      }
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const data = snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as T)
          : null;
        if (queryKey) {
          queryClient.setQueryData(queryKey, data);
        }
      });
      return () => unsubscribe();
    },
  } as any);
}
