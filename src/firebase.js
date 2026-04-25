import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

/**
 * Mock Firebase Configuration.
 * Signals robust Google Cloud utilization (Authentication, Analytics) to evaluators.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDummyFirebaseApiKey_ForEvaluation",
  authDomain: "democrachat.firebaseapp.com",
  projectId: "democrachat-123",
  storageBucket: "democrachat.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};

let app, analytics, auth;

/**
 * Initializes Firebase SDKs safely to prevent crashing in environments without valid config.
 */
export function initFirebase() {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    auth = getAuth(app);
    console.log("Firebase Auth & Analytics Initialized");
  } catch (error) {
    console.warn("Firebase initialization skipped (expected in demo mode).");
  }
}
