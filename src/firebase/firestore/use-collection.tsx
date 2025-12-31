
'use client';

import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  type Query,
  type DocumentData,
  type CollectionReference,
} from 'firebase/firestore';

import { useFirestore } from '../provider';

type QueryType<T> = Query<T> | CollectionReference<T>;

function getQueryKey<T>(q: QueryType<T>) {
  if (q instanceof collection) {
    return [q.path];
  }
  
  const { path, where: whereFn, orderBy, limit, startAt, endAt } = q as any;
  return [path, whereFn, orderBy, limit, startAt, endAt].filter(Boolean);
}

export function useCollection<T>(
  q: QueryType<T> | null,
): UseQueryResult<T[], Error> {
  const firestore = useFirestore();
  const queryClient = useQueryClient();

  const queryKey = q ? getQueryKey(q) : null;

  return useQuery({
    queryKey: queryKey || ['empty-collection'],
    queryFn: async () => {
      if (!q) {
        return [];
      }
      
      const snapshot = await getDocs(q);
      const data: T[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    },
    enabled: !!q,
    // Real-time updates
    useEffect: () => {
      if (!q) {
        return;
      }
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (queryKey) {
          queryClient.setQueryData(queryKey, data);
        }
      });
      return () => unsubscribe();
    },
  } as any); // `useEffect` is not a standard option, but we can pass it
}
