// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  authDomain: "local.firebaseapp.com",
  projectId: "workoutstats-b571c",
  storageBucket: "local.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:aaaaaaaaaaaaaaaaaaaaaa",
  measurementId: "G-AAAAAAAAAA",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099");
export const db = getFirestore(app);
connectFirestoreEmulator(db, "127.0.0.1", 8080);
