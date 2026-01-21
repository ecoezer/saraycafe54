import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase configuration incomplete. Check .env file for required variables:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasAppId: !!firebaseConfig.appId
  });
}

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

export { db };
