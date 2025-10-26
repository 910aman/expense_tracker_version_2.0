// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNa-ZHoJAfv5zerSe01ZzQ7T3W2zEgnLc",
  authDomain: "expense-tracker-60fcb.firebaseapp.com",
  projectId: "expense-tracker-60fcb",
  storageBucket: "expense-tracker-60fcb.firebasestorage.app",
  messagingSenderId: "1040927312711",
  appId: "1:1040927312711:web:8a9c8959be41c2fb089a62",
  measurementId: "G-FRDQYX131E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const fireStore = getFirestore(app);