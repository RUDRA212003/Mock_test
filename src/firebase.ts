export async function updateUserSummaryByEmail(email: string, summary: string) {
  // Find user by email
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0].ref;
    await updateDoc(userDoc, { aiSummary: summary });
    return true;
  }
  return false;
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPFg6fZVjWbkel1R6aFf4x_FDuGM_u4XE",
  authDomain: "intreview-platform.firebaseapp.com",
  projectId: "intreview-platform",
  storageBucket: "intreview-platform.firebasestorage.app",
  messagingSenderId: "402442319261",
  appId: "1:402442319261:web:3d0d847c0a7b51036f2b74",
  measurementId: "G-PLS28Q81X9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };

export async function updateUserScoreByEmail(email: string, score: number) {
  // Find user by email
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0].ref;
    await updateDoc(userDoc, { score });
    return true;
  }
  return false;
}