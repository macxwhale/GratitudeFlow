
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser && pathname === '/login') {
        router.push('/');
      } else if (!currentUser && pathname !== '/login') {
        // Allow access to /login page even if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  const signUpWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      toast({ title: "Account Created!", description: "Welcome aboard!" });
      router.push('/');
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      toast({ title: "Signed In!", description: "Welcome back!" });
      router.push('/');
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({ title: "Sign In Failed", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      toast({ title: "Signed In with Google!", description: "Welcome!" });
      router.push('/');
      return result.user;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({ title: "Google Sign In Failed", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({ title: "Signed Out", description: "See you soon!" });
      router.push('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
