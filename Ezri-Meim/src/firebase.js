// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBMUpdXaqI8Vg9E3Se963dvQhRehJ9PFI0",
  authDomain: "ezri-meim.firebaseapp.com",
  projectId: "ezri-meim",
  storageBucket: "ezri-meim.appspot.com",
  messagingSenderId: "297701922194",
  appId: "1:297701922194:web:40adc902b18c376cb21d4b",
  measurementId: "G-MF1NSVVWRP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions }; // Export functions along with auth and db
