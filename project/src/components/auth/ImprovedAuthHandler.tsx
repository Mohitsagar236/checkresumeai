import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

// Enhanced authentication handler with comprehensive error handling and timeout management
export function useImprovedAuthHandler() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeouts
  const clearAuthTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Enhanced login function with comprehensive error handling
  const handleLogin = useCallback(async (email: string, password: string) => {
    console.log('🔐 Starting enhanced login process...');
    
    // Reset previous states
    setLoading(true);
    setError(null);
    clearAuthTimeout();

    // Input validation
    if (!email || !password) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMsg = 'Please enter a valid email address';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    // Set up timeout protection (20 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        console.error('⏰ Login timeout reached (20s)');
        reject(new Error('Login is taking longer than expected. Please check your connection and try again.'));
      }, 20000);
    });

    try {
      console.log('📧 Attempting email/password authentication...');
      
      // Race between authentication and timeout
      const authPromise = signIn(email, password);
      const result = await Promise.race([authPromise, timeoutPromise]);
      
      // Clear timeout on success
      clearAuthTimeout();
      
      console.log('✅ Authentication result received:', { hasUser: !!result.user, hasError: !!result.error });
      
      if (result.error) {
        console.error('❌ Authentication error:', result.error.message);
        const errorMsg = getReadableErrorMessage(result.error.message);
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
      
      if (result.user) {
        console.log('🎉 Login successful for user:', result.user.email);
        showToast('Successfully logged in!', 'success');
        return { success: true, user: result.user };
      } else {
        console.warn('⚠️ No user or error returned from authentication');
        const errorMsg = 'Authentication failed. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      clearAuthTimeout();
      console.error('💥 Login exception:', error);
      
      const errorMsg = error instanceof Error 
        ? getReadableErrorMessage(error.message)
        : 'An unexpected error occurred. Please try again.';
      
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      console.log('🔄 Clearing loading state');
      setLoading(false);
      clearAuthTimeout();
    }
  }, [signIn, showToast, clearAuthTimeout]);

  // Enhanced signup function with comprehensive error handling
  const handleSignup = useCallback(async (email: string, password: string, confirmPassword?: string) => {
    console.log('📝 Starting enhanced signup process...');
    
    // Reset previous states
    setLoading(true);
    setError(null);
    clearAuthTimeout();

    // Input validation
    if (!email || !password) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMsg = 'Please enter a valid email address';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    if (password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    if (confirmPassword && password !== confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      setLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    // Set up timeout protection (25 seconds for signup as it might take longer)
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        console.error('⏰ Signup timeout reached (25s)');
        reject(new Error('Signup is taking longer than expected. Please check your connection and try again.'));
      }, 25000);
    });

    try {
      console.log('📧 Attempting email signup...');
      
      // Race between signup and timeout
      const authPromise = signUp(email, password);
      const result = await Promise.race([authPromise, timeoutPromise]);
      
      // Clear timeout on success
      clearAuthTimeout();
      
      console.log('✅ Signup result received:', { hasUser: !!result.user, hasError: !!result.error });
      
      if (result.error) {
        console.error('❌ Signup error:', result.error.message);
        const errorMsg = getReadableErrorMessage(result.error.message);
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
      
      if (result.user) {
        console.log('🎉 Signup successful for user:', result.user.email);
        showToast('Successfully signed up! Please check your email to verify your account.', 'success');
        return { success: true, user: result.user };
      } else {
        console.warn('⚠️ No user or error returned from signup');
        const errorMsg = 'Signup failed. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      clearAuthTimeout();
      console.error('💥 Signup exception:', error);
      
      const errorMsg = error instanceof Error 
        ? getReadableErrorMessage(error.message)
        : 'An unexpected error occurred during signup. Please try again.';
      
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      console.log('🔄 Clearing loading state');
      setLoading(false);
      clearAuthTimeout();
    }
  }, [signUp, showToast, clearAuthTimeout]);

  // Clear error when user starts typing
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Force clear loading state (emergency reset)
  const forceReset = useCallback(() => {
    console.log('🚨 Force reset called - clearing all auth states');
    setLoading(false);
    setError(null);
    clearAuthTimeout();
  }, [clearAuthTimeout]);

  return {
    loading,
    error,
    handleLogin,
    handleSignup,
    clearError,
    forceReset
  };
}

// Helper function to convert technical error messages to user-friendly ones
function getReadableErrorMessage(errorMessage: string): string {
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
  
  if (message.includes('user already registered') || message.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('password') && message.includes('weak')) {
    return 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
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
}

// Example usage component
export function ExampleAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { 
    loading, 
    error, 
    handleLogin, 
    handleSignup, 
    clearError,
    forceReset 
  } = useImprovedAuthHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = await handleLogin(email, password);
      if (result.success) {
        // Handle successful login (e.g., close modal, redirect)
        console.log('Login successful, user:', result.user);
      }
    } else {
      const result = await handleSignup(email, password, confirmPassword);
      if (result.success) {
        // Handle successful signup
        console.log('Signup successful, user:', result.user);
      }
    }
  };

  // Emergency reset button (for testing/debugging)
  const handleEmergencyReset = () => {
    forceReset();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          disabled={loading}
          required
          className="w-full p-3 border rounded-md"
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
          disabled={loading}
          required
          className="w-full p-3 border rounded-md"
        />
      </div>
      
      {!isLogin && (
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError();
            }}
            disabled={loading}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        {loading ? (
          <>
            <span className="opacity-0">{isLogin ? 'Sign In' : 'Sign Up'}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </>
        ) : (
          isLogin ? 'Sign In' : 'Sign Up'
        )}
      </button>
      
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="w-full text-blue-600 hover:underline"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
      
      {/* Emergency reset for testing */}
      <button
        type="button"
        onClick={handleEmergencyReset}
        className="w-full text-sm text-gray-500 hover:text-gray-700"
      >
        Reset Form (Emergency)
      </button>
    </form>
  );
}
