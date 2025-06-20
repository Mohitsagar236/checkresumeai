import React from 'react';
import type { Session, User } from '@supabase/supabase-js';

// Create context with default values
interface Profile {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
  created_at: string;
}

export const AuthContext = React.createContext<{
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<(() => void) | undefined>;
  signOut: () => Promise<void>;
}>({
  user: null,
  session: null,
  profile: null,  isLoading: true,
  signIn: async () => ({ user: null, error: new Error('Not implemented') }),
  signUp: async () => ({ user: null, error: new Error('Not implemented') }),
  signInWithOAuth: async () => undefined,
  signOut: async () => {}
});