"use client";

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialization
const firebase = initializeApp(firebaseConfig);

// Analytics
let analytics: any;
isSupported().then((supported: any) => {
  if (supported) {
    analytics = getAnalytics(firebase);
    // process.env.NODE_ENV == "development" &&
    //   console.log("Firebase Analytics initialized");
  } else {
    // process.env.NODE_ENV == "development" &&
    //   console.log("Firebase Analytics not supported in this environment");
  }
});

export { firebase, analytics };