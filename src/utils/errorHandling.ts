import { PostgrestError } from '@supabase/supabase-js';

export function handleSupabaseError(error: PostgrestError | Error): Error {
  if ('code' in error) {
    const pgError = error as PostgrestError;
    switch (pgError.code) {
      case '404':
        return new Error('Resource not found');
      case '403':
        return new Error('Access denied');
      case '401':
        return new Error('Unauthorized');
      case '429':
        return new Error('Too many requests. Please try again later.');
      default:
        return new Error(pgError.message || 'An error occurred');
    }
  }
  return error;
}

export function isSupabaseError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
} 