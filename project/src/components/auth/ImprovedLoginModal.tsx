import React, { useState, useEffect, useCallback } from 'react';
import { X, Github } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { LoginModalProps } from './LoginModal.types';
import { useAuth } from '../../hooks/useAuth';
import { useOAuthWithTimeout } from '../../hooks/useOAuthWithTimeout';
import { useToast } from '../../context/ToastContext';

export function LoginModal({ isOpen, onClose, onSignUpClick }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { signIn } = useAuth();
  const { oauthLoading, handleOAuthSignIn, clearOAuthLoading } = useOAuthWithTimeout();
  const { showToast } = useToast();
  
  // Helper function to convert technical error messages to user-friendly ones
  const getReadableErrorMessage = useCallback((errorMessage: string): string => {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (message.includes('email not confirmed') || message.includes('email not verified')) {
      return 'Please check your email and click the verification link before signing in.';
    }
    
    if (message.includes('user not found')) {
      return 'No account found with this email address. Please sign up first.';
    }
    
    if (message.includes('rate limit') || message.includes('too many')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
      return 'Connection issue. Please check your internet connection and try again.';
    }
    
    if (message.includes('invalid email') || message.includes('email format')) {
      return 'Please enter a valid email address.';
    }
    
    // Return original message if no pattern matches, but clean it up
    return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
  }, []);

  // Force reset function for emergency cases
  const forceReset = useCallback(() => {
    console.log('🚨 LoginModal: Force reset triggered - clearing all states');
    setIsLoading(false);
    setFormError('');
    setEmail('');
    setPassword('');
    clearOAuthLoading();
  }, [clearOAuthLoading]);

  // OAuth sign in with enhanced error handling
  const handleOAuthSignInWithError = useCallback(async (provider: 'google' | 'github') => {
    console.log(`LoginModal: Starting ${provider} OAuth authentication`);
    
    try {
      await handleOAuthSignIn(provider, (error) => {
        console.error(`LoginModal: ${provider} OAuth error:`, error);
        setFormError(error);
      });
    } catch (error) {
      console.error(`LoginModal: ${provider} OAuth exception:`, error);
      setFormError(`Failed to sign in with ${provider}. Please try again.`);
    }
  }, [handleOAuthSignIn]);

  // Enhanced form submission with comprehensive error handling
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Input validation
    if (!email || !password) {
      const errorMsg = 'Please fill in all fields';
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMsg = 'Please enter a valid email address';
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    console.log('🔐 LoginModal: Starting enhanced email/password authentication');
    setIsLoading(true);

    // Clear any existing timeout
    let timeoutId: NodeJS.Timeout | null = null;

    // Create a timeout promise with better error handling
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        console.error('⏰ LoginModal: Authentication timeout reached (20s)');
        reject(new Error('Login is taking longer than expected. Please check your connection and try again.'));
      }, 20000);
    });

    try {
      console.log('📧 LoginModal: Attempting email/password authentication...');
      
      // Race between authentication and timeout
      const authPromise = signIn(email, password);
      const result = await Promise.race([authPromise, timeoutPromise]);
      
      // Clear timeout on completion
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      console.log('✅ LoginModal: Authentication result received:', { hasUser: !!result.user, hasError: !!result.error });
      
      if (result.error) {
        console.error('❌ LoginModal: Authentication error:', result.error.message);
        const errorMsg = getReadableErrorMessage(result.error.message);
        setFormError(errorMsg);
        showToast(errorMsg, 'error');
        return;
      }
      
      if (result.user) {
        console.log('🎉 LoginModal: Authentication successful, closing modal');
        showToast('Successfully logged in!', 'success');
        onClose();
      } else {
        console.warn('⚠️ LoginModal: No user or error returned from authentication');
        const errorMsg = 'Authentication failed. Please try again.';
        setFormError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      // Clean up timeout on error
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      console.error('💥 LoginModal: Authentication exception:', error);
      const errorMsg = error instanceof Error 
        ? getReadableErrorMessage(error.message)
        : 'An unexpected error occurred. Please try again.';
      
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      console.log('🔄 LoginModal: Clearing loading state');
      setIsLoading(false);
      
      // Final cleanup of timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [email, password, signIn, getReadableErrorMessage, showToast, onClose]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      console.log('LoginModal: Resetting states on modal close');
      setEmail('');
      setPassword('');
      setFormError('');
      setIsLoading(false);
      clearOAuthLoading();
    }
  }, [isOpen, clearOAuthLoading]);

  // Force clear loading states when component unmounts
  useEffect(() => {
    return () => {
      console.log('LoginModal: Component unmounting, clearing all loading states');
      setIsLoading(false);
      clearOAuthLoading();
    };
  }, [clearOAuthLoading]);

  // Add keyboard shortcut for force reset (Ctrl+R or Cmd+R in modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        console.log('🚨 LoginModal: Force reset via keyboard shortcut');
        forceReset();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, forceReset]);

  if (!isOpen) return null;
  return (    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent 
        className="stable-modal"
        style={{
          width: '448px',
          maxWidth: '90vw',
          minHeight: '500px',
          padding: '24px',
          transform: 'none'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-premium-display font-bold text-center text-gradient-luxury">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300 font-luxury">
            Sign in to your account to continue
          </DialogDescription>
        </DialogHeader>
          <button
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
              onClick={() => handleOAuthSignInWithError('google')}
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
              onClick={() => handleOAuthSignInWithError('github')}
              disabled={isLoading || !!oauthLoading}
              style={{ width: '100%', height: '48px' }}
            >
              <Github className={`w-5 h-5 mr-2 transition-none ${oauthLoading === 'github' ? 'animate-spin' : ''} text-gray-700 dark:text-gray-300`} />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
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
                  setFormError('');
                }}
                disabled={isLoading || !!oauthLoading}
                required
                aria-label="Email"
                className="h-12 font-luxury border-gradient-premium focus:shadow-luxury-md transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 focus:from-blue-50 focus:to-indigo-50 dark:focus:from-slate-700 dark:focus:to-slate-600"
              />
            </div>
            <div className="space-y-1">              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setFormError('');
                }}
                disabled={isLoading || !!oauthLoading}
                required
                aria-label="Password"
                className="h-12 font-luxury border-gradient-premium focus:shadow-luxury-md transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 focus:from-blue-50 focus:to-indigo-50 dark:focus:from-slate-700 dark:focus:to-slate-600"
              />
            </div>
            {formError && (
              <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 font-luxury">
                {formError}
              </div>
            )}            <Button 
              type="submit" 
              className="w-full h-12 btn-premium-luxury font-luxury font-medium text-base shadow-luxury-lg hover:shadow-luxury-xl transition-shadow duration-300 relative" 
              disabled={isLoading || !!oauthLoading}
            >
              <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                Sign In
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Button>
          </form>
          
          {/* Emergency reset button for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              onClick={forceReset}
              className="w-full text-xs text-gray-400 hover:text-gray-600"
            >
              Force Reset (Dev)
            </Button>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-luxury">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-gradient-luxury font-medium hover:opacity-80 transition-opacity duration-300 underline decoration-2 underline-offset-2"
            >
              Sign up here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
