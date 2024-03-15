// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-7400a.firebaseapp.com",
  projectId: "mern-blog-7400a",
  storageBucket: "mern-blog-7400a.appspot.com",
  messagingSenderId: "130748193038",
  appId: "1:130748193038:web:f9e2e14e921337cb671f5f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

