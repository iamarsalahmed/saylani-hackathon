'use client';
import React, { useState } from 'react';
import { auth, db, collection, addDoc, createUserWithEmailAndPassword } from '../(database)/firebase-config';
import '../globals.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import  './styles.css'; 

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await addDoc(collection(db, "user"), {
          name,
          email,
          userId: user.uid,
        });
        
        localStorage.setItem('myId', user.uid);

        setLoading(false);
        await Swal.fire({
          title: "Sign Up Successful",
          text: email,
          icon: "success",
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: error.code,
          text: error.message,
        });
      });
  };

  return (
    <div className="signup-container">
        <form onSubmit={handleSubmit}>
            <h1>Sign Up Page</h1>
            <label htmlFor="name">Name</label>
            <input onChange={(e) => setName(e.target.value)} type="text" className="input" name="name" id="name" />
            
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" className="input" name="email" id="email" />
            
            <label htmlFor="password">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" className="input" name="password" id="password" />
            
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <button type="submit">Sign Up</button>
            )}
        </form>
    </div>
);
};

export default SignUp;
