// backend/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcX3eMmzfFJpy0KqwmVs5eMe02du_7q14",
  authDomain: "webapp-c008f.firebaseapp.com",
  projectId: "webapp-c008f",
  storageBucket: "webapp-c008f.firebasestorage.app",
  messagingSenderId: "522251568546",
  appId: "1:522251568546:web:9dade90602a3ea72401efb",
  measurementId: "G-75EYNQWTD0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
