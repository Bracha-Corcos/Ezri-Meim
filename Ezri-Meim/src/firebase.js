// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // import { getFirestore, doc } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // // Your web app's Firebase configuration
// // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBMUpdXaqI8Vg9E3Se963dvQhRehJ9PFI0",
//     authDomain: "ezri-meim.firebaseapp.com",
//     projectId: "ezri-meim",
//     storageBucket: "ezri-meim.appspot.com",
//     messagingSenderId: "297701922194",
//     appId: "1:297701922194:web:40adc902b18c376cb21d4b",
//     measurementId: "G-MF1NSVVWRP"
//   };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// const auth = getAuth(app);

// export { app, db, auth };


// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
