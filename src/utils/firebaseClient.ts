import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbSignUp, 
  signOut as fbSignOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Missing Firebase configuration. Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, and VITE_FIREBASE_PROJECT_ID in your .env file');
}

if (!getApps().length) {
  initializeApp(firebaseConfig as any);
}

export const auth = getAuth();

export const onAuthChange = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);

export const signIn = (email: string, password: string) => fbSignIn(auth, email, password);
export const signUp = (email: string, password: string) => fbSignUp(auth, email, password);
export const signOut = () => fbSignOut(auth);

export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// OAuth providers
export const signInWithOAuthProvider = async (provider: 'google' | 'github', useRedirect: boolean = false) => {
  let authProvider;
  
  if (provider === 'google') {
    authProvider = new GoogleAuthProvider();
    authProvider.addScope('profile');
    authProvider.addScope('email');
  } else if (provider === 'github') {
    authProvider = new GithubAuthProvider();
    authProvider.addScope('user:email');
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  try {
    if (useRedirect) {
      // Use redirect for mobile or environments where popups are blocked
      await signInWithRedirect(auth, authProvider);
      return { user: null, error: null }; // User will be set after redirect
    } else {
      // Use popup for desktop
      const result = await signInWithPopup(auth, authProvider);
      return { user: result.user, error: null };
    }
  } catch (error: any) {
    // Handle user cancellation gracefully
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the sign-in popup');
      return { user: null, error: { code: 'auth/popup-closed-by-user', message: 'Sign-in cancelled', isCancellation: true } };
    }
    
    // Handle popup blocked
    if (error.code === 'auth/popup-blocked') {
      console.warn('Popup was blocked by browser');
      return { user: null, error: { code: 'auth/popup-blocked', message: 'Pop-up blocked. Please allow pop-ups for this site or try the redirect method.', isCancellation: false } };
    }
    
    console.error('Firebase OAuth error:', error);
    return { user: null, error };
  }
};

// Handle OAuth redirect result
export const handleOAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return { user: result.user, error: null };
    }
    return { user: null, error: null };
  } catch (error: any) {
    console.error('Firebase OAuth redirect error:', error);
    return { user: null, error };
  }
};

export default auth;

