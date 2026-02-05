import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIANQH87AVTl9ms_V9zx_695Em8G9-mAU",
  authDomain: "securityramarama.firebaseapp.com",
  projectId: "securityramarama",
  storageBucket: "securityramarama.firebasestorage.app",
  messagingSenderId: "968676126617",
  appId: "1:968676126617:web:2b5a580cfad27e3bc6ad08",
  measurementId: "G-8CJVL1B94N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
