import React, { useState, useEffect, memo } from 'react';
import { X, Github } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { SignUpModalProps } from './LoginModal.types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useOAuthWithTimeout } from '../../hooks/useOAuthWithTimeout';

// Base component that we'll wrap with React.memo
function SignUpModalComponent({ isOpen, onClose, onLoginClick }: SignUpModalProps) {
  // Remove excessive logging that contributes to re-renders
  
  const [email, setEmail] = useState('checkresmueai@gmail.com'); // Default to the proper email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const { 
    handleOAuthSignIn, 
    oauthLoading, 
    clearOAuthLoading  
  } = useOAuthWithTimeout();
    // Reset form when modal closes - using a ref to prevent unnecessary re-renders
  const isFirstRender = React.useRef(true);
  const isOpen_prev = React.useRef(isOpen);
  
  // Store clearOAuthLoading in a ref to avoid dependency issues
  const clearOAuthLoadingRef = React.useRef(clearOAuthLoading);
  
  // Update the ref when clearOAuthLoading changes
  React.useEffect(() => {
    clearOAuthLoadingRef.current = clearOAuthLoading;
  }, [clearOAuthLoading]);
  
  // Handle modal state changes with a stable effect
  useEffect(() => {
    // Skip the effect on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      isOpen_prev.current = isOpen;
      return;
    }
    
    // Only process when isOpen changes from true to false
    if (isOpen_prev.current && !isOpen) {
      // Reset form state only when modal closes
      setEmail('checkresmueai@gmail.com');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsLoading(false);
      
      // Use the ref to avoid dependency on clearOAuthLoading
      clearOAuthLoadingRef.current();
    }
    
    // Update previous value
    isOpen_prev.current = isOpen;
  }, [isOpen]);

  // Cleanup on component unmount - no dependencies needed
  useEffect(() => {
    return () => {
      // Use the ref instead of the function directly
      clearOAuthLoadingRef.current();
    };
  }, []);
  
  // Let Dialog handle visibility through its open prop
  
  // Add comprehensive form validation
  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 [SignupModal] Form submission started');
    setError('');
    
    if (!validateForm()) {
      console.log('[SignupModal] Form validation failed');
      return;
    }

    setIsLoading(true);
    console.log('📧 [SignupModal] Starting enhanced email signup process');

    // Clear any existing timeout
    let timeoutId: NodeJS.Timeout | null = null;

    // Create timeout promise with better error handling
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        console.error('⏰ [SignupModal] Signup timeout reached (25s)');
        reject(new Error('Signup is taking longer than expected. Please check your connection and try again.'));
      }, 25000); // 25 seconds for signup as it might take longer
    });

    try {
      console.log('📧 [SignupModal] Attempting email signup...');
      
      // Race between signup and timeout
      const authPromise = signUp(email, password);
      const result = await Promise.race([authPromise, timeoutPromise]);
      
      // Clear timeout on completion
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      console.log('✅ [SignupModal] Signup result received:', { hasUser: !!result.user, hasError: !!result.error });
      
      if (result.error) {
        console.error('❌ [SignupModal] Signup error:', result.error.message);
        const errorMsg = getReadableErrorMessage(result.error.message);
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return;
      }
      
      if (result.user) {
        console.log('🎉 [SignupModal] Signup successful');
        showToast('Successfully signed up! Please check your email to verify your account.', 'success');
        onClose();
      } else {
        console.warn('⚠️ [SignupModal] No user or error returned from signup');
        const errorMsg = 'Signup failed. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      // Clean up timeout on error
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      console.error('💥 [SignupModal] Signup exception:', error);
      const errorMsg = error instanceof Error 
        ? getReadableErrorMessage(error.message)
        : 'An unexpected error occurred during signup. Please try again.';
      
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      console.log('🔄 [SignupModal] Clearing loading state');
      setIsLoading(false);
      
      // Final cleanup of timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  // Helper function to convert technical error messages to user-friendly ones
  const getReadableErrorMessage = (errorMessage: string): string => {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('user already registered') || message.includes('already exists')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    
    if (message.includes('password') && message.includes('weak')) {
      return 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
    }
    
    if (message.includes('invalid email') || message.includes('email format')) {
      return 'Please enter a valid email address.';
    }
    
    if (message.includes('rate limit') || message.includes('too many')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
      return 'Connection issue. Please check your internet connection and try again.';
    }
    
    // Return original message if no pattern matches, but clean it up
    return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
  };// Enhanced OAuth sign in with proper error handling
  const handleOAuthSignInClick = async (provider: 'google' | 'github') => {
    console.log(`[SignupModal] OAuth signin initiated for ${provider}`);
    
    if (oauthLoading || isLoading) {
      console.log(`[SignupModal] OAuth signin blocked - already loading (oauthLoading: ${oauthLoading}, isLoading: ${isLoading})`);
      return;
    }
    
    setError('');

    // Use the hook's handleOAuthSignIn with error callback
    await handleOAuthSignIn(provider, (error: string) => {
      console.error(`[SignupModal] ${provider} sign-in error:`, error);
      setError(error);
    });

    // If we reach here, OAuth was successful and we should close the modal
    console.log(`[SignupModal] OAuth signin successful for ${provider}`);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="stable-modal"
        data-testid="signup-modal"
        style={{
          width: '448px',
          maxWidth: '90vw',
          minHeight: '500px',
          padding: '24px',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          top: '50%',
          left: '50%'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-premium-display font-bold text-center text-gradient-luxury">
            Join Our Community
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300 font-luxury">
            Create your account to unlock premium resume insights
          </DialogDescription>
        </DialogHeader>        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-none rounded-lg p-2"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-3">            <Button
              type="button"
              variant="outline"
              className="w-full h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 group transition-none"
              onClick={() => handleOAuthSignInClick('google')}
              disabled={isLoading || !!oauthLoading}
              style={{ width: '100%', height: '48px' }}
            >
              <svg className={`w-5 h-5 mr-2 transition-none ${oauthLoading === 'google' ? 'animate-spin' : ''}`} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>              <span className="text-gray-700 dark:text-gray-300 transition-none">
                {oauthLoading === 'google' ? 'Processing...' : 'Google'}
              </span>
            </Button>            <Button
              type="button"
              variant="outline"
              className="w-full h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 group transition-none"
              onClick={() => handleOAuthSignInClick('github')}
              disabled={isLoading || !!oauthLoading}
              style={{ width: '100%', height: '48px' }}
            >              <Github className={`w-5 h-5 mr-2 transition-none ${oauthLoading === 'github' ? 'animate-spin' : ''} text-gray-700 dark:text-gray-300`} /><span className="text-gray-700 dark:text-gray-300 transition-none">
                {oauthLoading === 'github' ? 'Processing...' : 'GitHub'}
              </span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-premium opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-luxury">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isLoading || !!oauthLoading}
                required
                aria-label="Email"
                className="h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 transition-none"
                style={{ height: '48px' }}
              />
            </div>
            <div className="space-y-1">              <Input
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading || !!oauthLoading}
                required
                aria-label="Password"
                className="h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 transition-none"
                style={{ height: '48px' }}
              />
            </div>
            <div className="space-y-1">              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading || !!oauthLoading}
                required
                aria-label="Confirm Password"
                className="h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 transition-none"
                style={{ height: '48px' }}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 font-luxury">
                {error}
              </div>
            )}            <Button 
              type="submit" 
              className="w-full h-12 btn-premium-luxury font-luxury font-medium text-base relative transition-none" 
              disabled={isLoading || !!oauthLoading}
              style={{ width: '100%', height: '48px' }}
            >
              <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-none`}>
                Create Account
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-luxury">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-gradient-luxury font-medium hover:opacity-80 transition-opacity duration-300 underline decoration-2 underline-offset-2"
            >
              Sign in here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Use React.memo to prevent unnecessary re-renders
export const SignUpModal = React.memo(SignUpModalComponent);
