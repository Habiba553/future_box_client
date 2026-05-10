// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBexyyxZxU3qYalAW72fnbGP33knlFqjqE",
  authDomain: "movie-master-3676f.firebaseapp.com",
  projectId: "movie-master-3676f",
  storageBucket: "movie-master-3676f.firebasestorage.app",
  messagingSenderId: "860869688974",
  appId: "1:860869688974:web:8234824785b4df6ab0d3df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);