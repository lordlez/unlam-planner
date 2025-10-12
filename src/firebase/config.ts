import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTi0qXFqir2D0XfHaxEjKZR6iyoLSgId8",
  authDomain: "unlam-planner.firebaseapp.com",
  projectId: "unlam-planner",
  storageBucket: "unlam-planner.firebasestorage.app",
  messagingSenderId: "495945923893",
  appId: "1:495945923893:web:5273e71e053da3f67d607c"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);