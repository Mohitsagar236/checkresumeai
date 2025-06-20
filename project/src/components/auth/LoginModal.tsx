import React, { useState, useEffect } from 'react';
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
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      console.log('LoginModal: Resetting states on modal close');
      // Keep the default email as checkresmueai@gmail.com for easier testing
      setEmail('checkresmueai@gmail.com');
      setPassword('');
      setFormError('');
      setIsLoading(false);
      clearOAuthLoading();
    } else {
      // When modal opens, ensure we have the default email set
      if (!email) setEmail('checkresmueai@gmail.com');
    }
  }, [isOpen, clearOAuthLoading, email]);

  // Force clear loading states when component unmounts
  useEffect(() => {
    return () => {
      console.log('LoginModal: Component unmounting, clearing all loading states');
      setIsLoading(false);
      clearOAuthLoading();
    };
  }, [clearOAuthLoading]);
  
  // Don't return null here - let the Dialog component handle visibility
  // This allows proper initialization of the Dialog before it's shown

  // Add basic form validation
  const validateForm = (): boolean => {
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    console.log('LoginModal: Starting email/password authentication');
    setIsLoading(true);

    // Create a more aggressive timeout for email/password
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        console.log('LoginModal: Email/password authentication timed out');
        reject(new Error('Authentication timed out. Please check your connection and try again.'));
      }, 20000); // Reduced to 20 seconds for faster feedback
    });

    try {
      const authPromise = signIn(email, password);
      console.log('LoginModal: Waiting for authentication result...');
      
      const result = await Promise.race([authPromise, timeoutPromise]);
      console.log('LoginModal: Authentication result received:', !!result.user);
      
      if (result.error) {
        console.error('LoginModal: Authentication error:', result.error);
        setFormError(result.error.message);
        return;
      }
      
      if (result.user) {
        console.log('LoginModal: Authentication successful, closing modal');
        showToast('Successfully logged in!', 'success');
        onClose();
      } else {
        console.warn('LoginModal: No user or error returned from authentication');
        setFormError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('LoginModal: Authentication exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      setFormError(errorMessage);
    } finally {
      console.log('LoginModal: Clearing loading state');
      setIsLoading(false);
    }
  };

  // OAuth sign in with enhanced error handling
  const handleOAuthSignInWithError = async (provider: 'google' | 'github') => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="stable-modal"
        data-testid="login-modal"
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
          <div className="grid grid-cols-2 gap-3">
            <Button
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
              </svg>
              <span className="text-gray-700 dark:text-gray-300 transition-none">
                {oauthLoading === 'google' ? 'Processing...' : 'Google'}
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 group transition-none"
              onClick={() => handleOAuthSignInWithError('github')}
              disabled={isLoading || !!oauthLoading}
              style={{ width: '100%', height: '48px' }}
            >
              <Github className={`w-5 h-5 mr-2 transition-none ${oauthLoading === 'github' ? 'animate-spin' : ''} text-gray-700 dark:text-gray-300`} />
              <span className="text-gray-700 dark:text-gray-300 transition-none">
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
            <div className="space-y-1">
              <Input
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
                className="h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 transition-none"
                style={{ height: '48px' }}
              />
            </div>
            <div className="space-y-1">
              <Input
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
                className="h-12 font-luxury border-gradient-premium bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 transition-none"
                style={{ height: '48px' }}
              />
            </div>
            {formError && (
              <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 font-luxury">
                {formError}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 btn-premium-luxury font-luxury font-medium text-base relative transition-none" 
              disabled={isLoading || !!oauthLoading}
              style={{ width: '100%', height: '48px' }}
            >
              <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-none`}>
                Sign In
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
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-gradient-luxury font-medium underline decoration-2 underline-offset-2 transition-none"
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
