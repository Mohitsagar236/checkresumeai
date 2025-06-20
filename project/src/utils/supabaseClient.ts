import { createClient, PostgrestError } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Profile type definition
interface CachedProfile {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
  created_at: string;
  cached_at: number;
}

// Helper function to validate session timestamps and handle clock skew
const validateSessionTimestamp = (session: Session | null): boolean => {
  if (!session || !session.expires_at) {
    return true; // Allow sessions without expiry info
  }

  try {
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();
    const skewTolerance = 5 * 60 * 1000; // 5 minutes tolerance

    // Check if session is expired (with tolerance for clock skew)
    if (expiresAt.getTime() + skewTolerance < now.getTime()) {
      console.warn('Session appears to be expired, may need refresh');
      return false;
    }    // Check if session was issued too far in the future (clock skew detection)
    // Since issued_at is not available in Session type, we'll skip this check

    return true;
  } catch (error) {
    console.warn('Error validating session timestamp:', error);
    return true; // Default to allowing session if validation fails
  }
}

// Helper function to cache profile data with size limits
let cachedProfile: CachedProfile | null = null;
const PROFILE_CACHE_KEY = 'ra-profile'; // Shorter key

// Try to load cached profile from localStorage with size check
try {
  const storedProfile = localStorage.getItem(PROFILE_CACHE_KEY);
  if (storedProfile && storedProfile.length < 2048) { // Limit cached profile size
    cachedProfile = JSON.parse(storedProfile);
  } else if (storedProfile && storedProfile.length >= 2048) {
    // Remove oversized cached profile
    localStorage.removeItem(PROFILE_CACHE_KEY);
  }
} catch (error) {
  console.warn('Failed to load cached profile:', error);
  // Clear potentially corrupted cache
  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch { /* ignore */ }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'ra-auth', // Shorter key to reduce storage size
    storage: {
      getItem: (key: string) => {
        try {
          const item = localStorage.getItem(key);
          // Truncate large items to prevent header issues
          if (item && item.length > 4096) {
            console.warn('Auth data too large, truncating');
            return null;
          }
          return item;
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          // Prevent storing excessively large auth data
          if (value.length > 4096) {
            console.warn('Auth data too large, not storing');
            return;
          }
          localStorage.setItem(key, value);
        } catch {
          // Ignore storage errors
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignore removal errors
        }
      }
    },
    flowType: 'implicit',
    debug: false
  },
  global: {
    headers: { 
      'x-app': 'ra' // Much shorter header
    },
    fetch: (url, options = {}) => {
      // Remove potentially large headers that might cause 431 errors
      const cleanOptions = { ...options };
      if (cleanOptions.headers) {
        const headers = cleanOptions.headers as Record<string, string>;
        // Remove or truncate large headers
        Object.keys(headers).forEach(key => {
          if (headers[key] && headers[key].length > 1024) {
            delete headers[key];
          }
        });
      }
      
      return fetch(url, {
        ...cleanOptions,
        signal: AbortSignal.timeout(10000)
      });
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    timeout: 30000,
    params: {
      eventsPerSecond: 2
    }
  }
});

type SupabaseErrorType = PostgrestError | Error | unknown;

// Helper function to handle Supabase errors including clock skew issues
export const handleSupabaseError = (error: SupabaseErrorType): string => {
  if (error instanceof PostgrestError) {
    if (error.code === '404' || error.message?.includes('404')) {
      return 'Resource not found. Please check if the requested data exists.';
    }
    if (error.code === '403' || error.message?.includes('403')) {
      return 'Access denied. You may not have permission to perform this action.';
    }
    if (error.code === '401' || error.message?.includes('401')) {
      return 'Authentication required. Please sign in and try again.';
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    // Handle clock skew specific errors
    if (error.message?.includes('issued in the future') || error.message?.includes('clock skew')) {
      return 'Authentication timing issue detected. Please try signing in again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again later.';
};

// Enhanced session management with clock skew protection
export const getValidSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      // Handle clock skew errors specifically
      if (error.message?.includes('issued in the future') || error.message?.includes('clock skew')) {
        console.warn('Clock skew detected, attempting session refresh...');
        
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Session refresh failed:', refreshError);
          return { session: null, error: refreshError };
        }
        
        return { session: refreshData.session, error: null };
      }
      
      return { session: null, error };
    }
    
    // Validate session timestamp
    if (session && !validateSessionTimestamp(session)) {
      console.warn('Session failed timestamp validation, attempting refresh...');
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Session refresh failed:', refreshError);
        return { session: null, error: refreshError };
      }
      
      return { session: refreshData.session, error: null };
    }
    
    return { session, error: null };
  } catch (error) {
    console.error('Error getting valid session:', error);
    return { session: null, error };
  }
};

// Helper function to retry failed requests with faster delays
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 500 // Reduced from 1000ms to 500ms for faster responses
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i === maxRetries - 1) break;
      
      if (error instanceof PostgrestError && error.code === '429') {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error('Maximum retries reached');
};

// Profile type and cache utilities
export const clearProfileCache = () => {
  cachedProfile = null;
  localStorage.removeItem(PROFILE_CACHE_KEY);
};

export const getCachedProfile = (): CachedProfile | null => {
  return cachedProfile;
};

export const setCachedProfile = (profile: Omit<CachedProfile, 'cached_at'>) => {
  const profileWithTimestamp = {
    ...profile,
    cached_at: Date.now()
  };
  cachedProfile = profileWithTimestamp;
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileWithTimestamp));
  } catch (error) {
    console.warn('Failed to cache profile:', error);
  }
};
