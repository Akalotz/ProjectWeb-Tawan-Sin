// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf45GphzvM_r9oHaGl63-Damd28m7fKfA",
  authDomain: "projectweb-tawan-sin.firebaseapp.com",
  projectId: "projectweb-tawan-sin",
  storageBucket: "projectweb-tawan-sin.firebasestorage.appT",
  messagingSenderId: "513960899241",
  appId: "1:513960899241:web:85f8ce241caaaacc012fb8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);