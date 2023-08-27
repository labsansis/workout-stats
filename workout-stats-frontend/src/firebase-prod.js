// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlVhdIKxQfEOGQFIiiVxIbRGYlvEeUQtQ",
  authDomain: "workoutstats-b571c.firebaseapp.com",
  projectId: "workoutstats-b571c",
  storageBucket: "workoutstats-b571c.appspot.com",
  messagingSenderId: "470164544317",
  appId: "1:470164544317:web:cf9336144eb32a2f138354",
  measurementId: "G-BGVNDQFB9H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
