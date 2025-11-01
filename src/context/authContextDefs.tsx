import React from 'react';
import type { User } from 'firebase/auth';

// Create context with default values
interface Profile {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
  created_at: string;
}

interface FirebaseSession {
  id_token: string;
  user: {
    id: string;
    email: string | null;
  };
}

export const AuthContext = React.createContext<{
  user: User | null;
  session: FirebaseSession | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  session: null,
  profile: null,  isLoading: true,
  signIn: async () => ({ user: null, error: new Error('Not implemented') }),
  signUp: async () => ({ user: null, error: new Error('Not implemented') }),
  signInWithOAuth: async () => {},
  signOut: async () => {}
});