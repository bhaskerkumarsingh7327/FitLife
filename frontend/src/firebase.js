import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Niche di gayi strings ("YOUR_...") ko hata kar apni asli Firebase keys yahan paste karein:
const firebaseConfig = {
 apiKey: "AIzaSyCuz0L3GfLe1sKymyXtdlHMn35juJ-twvI",
  authDomain: "fitlife-app-69eb0.firebaseapp.com",
  projectId: "fitlife-app-69eb0",
  storageBucket: "fitlife-app-69eb0.firebasestorage.app",
  messagingSenderId: "832605739595",
  appId: "1:832605739595:web:9cde5b4c781c58a010cbce",
  measurementId: "G-W8M6DYNDZ0"
};
let auth, googleProvider, appleProvider;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  appleProvider = new OAuthProvider('apple.com');
} catch (error) { console.warn("Firebase configuration pending."); }

export { auth, googleProvider, appleProvider };