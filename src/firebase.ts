import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVnrkuOD5-rsIahhlsMMwxvaOPySuhw6Q",
  authDomain: "manhwee-tracker.firebaseapp.com",
  projectId: "manhwee-tracker",
  storageBucket: "manhwee-tracker.firebasestorage.app",
  messagingSenderId: "860584906694",
  appId: "1:860584906694:web:0255813968b5a7603dacc7",
  measurementId: "G-F5YWCELSV8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);