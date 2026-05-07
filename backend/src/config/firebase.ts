import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { config } from './index.js';

let firebaseAuth: Auth | null = null;

try {
  if (!getApps().length) {
    const isPlaceholderKey =
      !config.firebase.privateKey ||
      config.firebase.privateKey.includes('YOUR_PRIVATE_KEY_HERE') ||
      !config.firebase.privateKey.includes('-----BEGIN PRIVATE KEY-----');

    if (!config.firebase.projectId || !config.firebase.clientEmail || isPlaceholderKey) {
      console.warn('⚠️  Firebase Admin SDK credentials not configured. Authentication will not work.');
      console.warn('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env');
    } else {
      initializeApp({
        credential: cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
        }),
      });
      firebaseAuth = getAuth();
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } else {
    firebaseAuth = getAuth();
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}

export const auth = firebaseAuth;

export const verifyIdToken = async (idToken: string) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    return { success: true, decodedToken, error: null };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { success: false, decodedToken: null, error };
  }
};

export const getUserByUid = async (uid: string) => {
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const userRecord = await firebaseAuth.getUser(uid);
    return { success: true, user: userRecord, error: null };
  } catch (error) {
    console.error('Failed to get user:', error);
    return { success: false, user: null, error };
  }
};
