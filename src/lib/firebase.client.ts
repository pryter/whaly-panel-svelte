import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { browser } from '$app/environment';

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;

const firebaseConfig = {
  apiKey: "AIzaSyDCMod8PpRB5EjmSDNfbt8RwTrE5sOLgOU",
  authDomain: "whaly-97950.firebaseapp.com",
  projectId: "whaly-97950",
  storageBucket: "whaly-97950.firebasestorage.app",
  messagingSenderId: "955360581459",
  appId: "1:955360581459:web:931b61c6e18bbc9fbd73a6",
}

export const initializeFirebase = () => {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.");
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
};