import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const VITE_FIREBASE_API_KEY= import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: "eventbite-e32e0.firebaseapp.com",
  projectId: "eventbite-e32e0",
  storageBucket: "eventbite-e32e0.appspot.com",
  messagingSenderId: "169416452003",
  appId: "1:169416452003:web:ef73e019306a54bf861c16"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);