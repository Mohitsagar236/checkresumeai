// Debug script to test OAuth redirect configuration
import { supabase } from './src/utils/supabaseClient.js';

console.log('=== Environment Debug Info ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_REDIRECT_URL:', import.meta.env.VITE_REDIRECT_URL);
console.log('Current Origin:', window.location.origin);
console.log('Is Development:', import.meta.env.DEV);

console.log('\n=== Supabase Configuration ===');
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Test OAuth URL generation
console.log('\n=== Testing OAuth URL Generation ===');
const redirectUrl = import.meta.env.VITE_REDIRECT_URL || 
  (import.meta.env.DEV ? 'http://localhost:5173/auth/callback' : `${window.location.origin}/auth/callback`);

console.log('Calculated Redirect URL:', redirectUrl);

// Test Google OAuth configuration
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: redirectUrl,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  }
}).then(({ data, error }) => {
  if (error) {
    console.error('OAuth configuration error:', error);
  } else {
    console.log('OAuth URL would be:', data?.url);
  }
}).catch(console.error);
