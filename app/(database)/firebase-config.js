import { initializeApp } from "firebase/app";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getFirestore, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Import deleteDoc

const firebaseConfig = {
  apiKey: "AIzaSyB11cJaXgdf8YMWoiwoT6UFiLoAAqeyGJk",
  authDomain: "chatapp-e50af.firebaseapp.com",
  projectId: "chatapp-e50af",
  storageBucket: "chatapp-e50af.appspot.com",
  messagingSenderId: "952545200156",
  appId: "1:952545200156:web:f3e3870660f39bd4ef37d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db, signOut, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, collection, query, where, signInWithEmailAndPassword, createUserWithEmailAndPassword };
