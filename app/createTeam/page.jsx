'use client';
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, auth } from '../(database)/firebase-config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import './styles.css';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = collection(db, 'user');
      const userSnapshot = await getDocs(userCollection);
      const users = userSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const handleUserSelection = (userId, userName) => {
    console.log("User Selected:", { userId, userName });
  
    setSelectedUsers(prev => {
      const isSelected = prev.some(user => user.userId === userId);
      return isSelected
        ? prev.filter(user => user.userId !== userId)
        : [...prev, { userId, name: userName }];
    });
  };
  
  const handleCreateTeam = async () => {
    if (!teamName || selectedUsers.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Please provide a team name and select at least one user',
      });
      return;
    }

    console.log('Selected Users:', selectedUsers);

    try {
      const currentUserId = auth.currentUser.uid;

      const teamsCollection = collection(db, 'teams');
      await addDoc(teamsCollection, {
        teamName,
        members: [...selectedUsers, { userId: currentUserId, name: "Team Leader" }],
        teamLeader: currentUserId,
      });

      Swal.fire({
        title: 'Team Created Successfully!',
        icon: 'success',
      });

      router.push('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error creating team',
        text: error.message,
      });
    }
  };

  return (
    <div className="create-team-container">
      <h1>Create Team</h1>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <h2>Select Users to Add to the Team</h2>
      <div className='map'>
        {allUsers.map(user => (
          <div key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedUsers.some(selected => selected.userId === user.userId)} 
                onChange={() => handleUserSelection(user.userId, user.name)}
              />
              {user.name} ({user.email})
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default CreateTeam;
