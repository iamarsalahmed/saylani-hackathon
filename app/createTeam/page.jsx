'use client';
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, auth } from '../(database)/firebase-config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

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
        id: doc.id, // This should correspond to the userId (uid) you want to store
      }));
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateTeam = async () => {
    if (!teamName || selectedUsers.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Please provide a team name and select at least one user',
      });
      return;
    }

    console.log('Selected User IDs:', selectedUsers); // Log selected user IDs

    try {
      const currentUserId = auth.currentUser.uid;

      // Add the new team to Firestore
      const teamsCollection = collection(db, 'teams');
      await addDoc(teamsCollection, {
        teamName,
        members: [...selectedUsers, currentUserId], // Ensure these are user IDs
        teamLeader: currentUserId,
      });
      
      Swal.fire({
        title: 'Team Created Successfully!',
        icon: 'success',
      });

      router.push('/dashboard'); // Redirect to Dashboard after creation
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error creating team',
        text: error.message,
      });
    }
  };

  return (
    <div>
      <h1>Create Team</h1>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <h2>Select Users to Add to the Team</h2>
      <div>
        {allUsers.map(user => (
          <div key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.userId)} // Ensure this corresponds to the userId
                onChange={() => handleUserSelection(user.userId)} // Change to user.id
              />
              {/* {console.log(user, "users")} */}
              {user.name} ({user.email})
              {console.log(user, 'map data')}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default CreateTeam;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { db, collection, getDocs, addDoc, auth } from '../(database)/firebase-config';
// import { useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';

// const CreateTeam = () => {
//   const [teamName, setTeamName] = useState('');
//   const [allUsers, setAllUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const userCollection = collection(db, 'user');
//       const userSnapshot = await getDocs(userCollection);
//       const users = userSnapshot.docs.map(doc => ({
//         ...doc.data(),
//         id: doc.id, // This should correspond to the user document ID
//       }));
//       setAllUsers(users);
//     };
//     fetchUsers();
//   }, []);

//   const handleUserSelection = (userId) => {
//     setSelectedUsers(prev =>
//       prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleCreateTeam = async () => {
//     if (!teamName || selectedUsers.length === 0) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Please provide a team name and select at least one user',
//       });
//       return;
//     }

//     console.log('Selected User IDs:', selectedUsers); // Log selected user IDs

//     try {
//       const currentUserId = auth.currentUser.uid;

//       // Add the new team to Firestore
//       const teamsCollection = collection(db, 'teams');
//       await addDoc(teamsCollection, {
//         teamName,
//         members: [...selectedUsers, currentUserId], // Ensure these are user IDs (document IDs)
//         teamLeader: currentUserId,
//       });
      
//       Swal.fire({
//         title: 'Team Created Successfully!',
//         icon: 'success',
//       });

//       router.push('/dashboard'); // Redirect to Dashboard after creation
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error creating team',
//         text: error.message,
//       });
//     }
//   };

//   return (
//     <div>
//       <h1>Create Team</h1>
//       <input
//         type="text"
//         placeholder="Team Name"
//         value={teamName}
//         onChange={(e) => setTeamName(e.target.value)}
//       />
//       <h2>Select Users to Add to the Team</h2>
//       <div>
//         {allUsers.map(user => (
//           <div key={user.id}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectedUsers.includes(user.userId)} // Ensure this corresponds to the user document ID
//                 onChange={() => handleUserSelection(user.userId)} // Change to user.id
//               />
//               {user.name} ({user.email})
//             </label>
//           </div>
//         ))}
//       </div>
//       <button onClick={handleCreateTeam}>Create Team</button>
//     </div>
//   );
// };

// export default CreateTeam;