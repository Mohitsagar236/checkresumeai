import * as admin from 'firebase-admin';
import { config } from './index.js';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App | null = null;

try {
  if (!admin.apps.length) {
    // Validate required environment variables
    if (!config.firebase.projectId || !config.firebase.clientEmail || !config.firebase.privateKey) {
      console.warn('⚠️  Firebase Admin SDK credentials not configured. Authentication will not work.');
      console.warn('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env');
    } else {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'), // Handle newlines in private key
        }),
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } else {
    firebaseApp = admin.app();
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}

export const auth = firebaseApp ? admin.auth() : null;
export const firebaseAdmin = admin;

// Verify Firebase ID token
export const verifyIdToken = async (idToken: string) => {
  if (!auth) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return { success: true, decodedToken, error: null };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { success: false, decodedToken: null, error };
  }
};

// Get user by UID
export const getUserByUid = async (uid: string) => {
  if (!auth) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  
  try {
    const userRecord = await auth.getUser(uid);
    return { success: true, user: userRecord, error: null };
  } catch (error) {
    console.error('Failed to get user:', error);
    return { success: false, user: null, error };
  }
};

export default firebaseAdmin;

