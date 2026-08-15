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

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!demoMode && !apiKey) {
  throw new Error(
    "Missing VITE_FIREBASE_API_KEY. Add the Firebase web API key to .env.local and restart Vite.",
  );
}

const firebaseConfig = {
  apiKey: apiKey ?? "demo-mode-no-firebase",
  authDomain: "vrate-7a0cd.firebaseapp.com",
  databaseURL: "https://vrate-7a0cd.firebaseio.com",
  projectId: "vrate-7a0cd",
  storageBucket: "vrate-7a0cd.appspot.com",
  messagingSenderId: "667991130799",
  appId: "1:667991130799:web:47f5a6eff1ecd3e5a10a5a",
  measurementId: "G-3Z0P83DTF2",
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
