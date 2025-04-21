// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "sms-app25june23.firebaseapp.com",
  databaseURL: "https://sms-app25june23-default-rtdb.firebaseio.com",
  projectId: "sms-app25june23",
  storageBucket: "sms-app25june23.firebasestorage.app",
  messagingSenderId: "57585631745",
  appId: "1:57585631745:web:4bf130fe5c6c95f8533600"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);