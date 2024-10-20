'use client';
import React, { useState } from 'react';
import {  auth,signInWithEmailAndPassword,getDocs,collection,db, doc, getDoc  } from '../(database)/firebase-config';
import { useRouter } from 'next/navigation'
// import '../globals.css';
import Swal from 'sweetalert2'
import  './styles.css'; // Import the CSS module
const SignIn = () => {
    const router = useRouter()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user's document directly
      const userDocRef = doc(db, 'user', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      // Check if the document exists
      if (userDoc.exists()) {
        const userData = userDoc.data(); // Get the document data
  
        if (userData.teamId) {
          console.log(`User belongs to team: ${userData.teamId}`);
        } else {
          console.log("User does not belong to any team yet.");
        }
      } else {
        console.log("User document does not exist.");
      }
  
      setLoading(false);
      await Swal.fire({
        title: "Sign In Successful",
        text: email,
        icon: "success",
      });
  
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: error.message,
        text: error,
      });
    }
  };
  
  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign In Page</h1>

        <label htmlFor="name">Name</label>
        <input 
          onChange={(e) => setName(e.target.value)} 
          type="text" 
          className="input" 
          name="name" 
          id="name" 
        />
        
        <label htmlFor="email">Email</label>
        <input 
          onChange={(e) => setEmail(e.target.value)} 
          type="email" 
          className="input" 
          name="email" 
          id="email" 
        />
        
        <label htmlFor="password">Password</label>
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          className="input" 
          name="password" 
          id="password" 
        />
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <button type="submit">Sign In</button>
        )}
      </form>
    </div>
  );
};

export default SignIn;
