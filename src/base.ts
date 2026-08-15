import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { demoMode } from "./config";

const requiredFirebaseSettings = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingFirebaseSettings = Object.entries(requiredFirebaseSettings)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (!demoMode && missingFirebaseSettings.length > 0) {
  throw new Error(
    `Missing Firebase configuration: ${missingFirebaseSettings.join(", ")}. Add the values from Firebase Console to .env.local and restart Vite.`,
  );
}

function configValue(value: string | undefined, demoValue: string): string {
  return value ?? demoValue;
}

const firebaseConfig = {
  apiKey: configValue(
    requiredFirebaseSettings.VITE_FIREBASE_API_KEY,
    "demo-mode-no-firebase",
  ),
  authDomain: configValue(
    requiredFirebaseSettings.VITE_FIREBASE_AUTH_DOMAIN,
    "demo-mode.firebaseapp.com",
  ),
  projectId: configValue(
    requiredFirebaseSettings.VITE_FIREBASE_PROJECT_ID,
    "demo-mode",
  ),
  storageBucket: configValue(
    requiredFirebaseSettings.VITE_FIREBASE_STORAGE_BUCKET,
    "demo-mode.firebasestorage.app",
  ),
  messagingSenderId: configValue(
    requiredFirebaseSettings.VITE_FIREBASE_MESSAGING_SENDER_ID,
    "000000000000",
  ),
  appId: configValue(
    requiredFirebaseSettings.VITE_FIREBASE_APP_ID,
    "1:000000000000:web:demo",
  ),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (!demoMode) {
  void setPersistence(auth, browserLocalPersistence).catch((error: unknown) => {
    console.error("Could not enable local authentication persistence.", error);
  });
}

export function handleSignout(): Promise<void> {
  if (demoMode) return Promise.resolve();
  return signOut(auth);
}
