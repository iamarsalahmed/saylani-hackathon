import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, updateDoc, deleteDoc } from '../(database)/firebase-config'; // Import Firestore functions
import Swal from 'sweetalert2';
import  './styles.css'; // Import the CSS module
const TeamCard = ({ team, userId, onDelete }) => {
  const [memberNames, setMemberNames] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState(team.teamName);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const fetchMemberNames = async () => {
      const namePromises = team.members.map(async (memberId) => {
        const memberDoc = await getDoc(doc(db, 'user', memberId));
        return memberDoc.exists() ? { id: memberId, name: memberDoc.data().name } : { id: memberId, name: 'Unknown Member' }; // Fallback if user doesn't exist
      });
      const names = await Promise.all(namePromises);
      setMemberNames(names);
      setSelectedMembers(team.members); 
      console.log(team, 'team members')// Initialize selected members for editing
    };
    
    fetchMemberNames();
  }, [team.members]);

  const isLeader = team.teamLeader === userId; // Check if the current user is the team leader
  const role = isLeader ? 'Team Leader' : team.members.includes(userId) ? 'Member' : 'Not a Member'; // Determine role

  const handleEdit = async () => {
    if (!newTeamName || selectedMembers.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Please provide a team name and select at least one member',
      });
      return;
    }

    try {
      const teamRef = doc(db, 'teams', team.id);
      await updateDoc(teamRef, {
        teamName: newTeamName,
        members: selectedMembers, // Update members
      });
      Swal.fire({
        title: 'Team Updated Successfully!',
        icon: 'success',
      });
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error updating team',
        text: error.message,
      });
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'teams', team.id)); // Ensure db is correctly imported
        onDelete(team.id); // Call onDelete prop to remove the card from the dashboard
        Swal.fire('Deleted!', 'Your team has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    }
  };

  return (
    <div className="team-card">
      <h2>{isEditing ? <input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} /> : team.teamName}</h2>
      <p><strong>Your Role:</strong> {role}</p>
      <h4>Members:</h4>
      <ul>
        {memberNames.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
      <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Save' : 'Edit'}</button>
      <button onClick={handleDelete}>Delete</button>
      {isEditing && (
        <div>
          <h4>Select Members:</h4>
          {team.members.map((memberId) => {
            const member = memberNames.find((name) => name.id === memberId);
            return (
              <div key={memberId}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(memberId)}
                    onChange={() => setSelectedMembers(prev =>
                      prev.includes(memberId)
                        ? prev.filter(id => id !== memberId)
                        : [...prev, memberId]
                    )}
                  />
                  {member ? member.name : 'Unknown Member'} {/* Handle missing members gracefully */}
                </label>
              </div>
            );
          })}
          <button onClick={handleEdit}>Update Team</button>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
// import React, { useState, useEffect } from 'react';
// import { db, doc, getDoc, updateDoc, deleteDoc } from '../(database)/firebase-config'; // Import Firestore functions
// import Swal from 'sweetalert2';

// const TeamCard = ({ team, userId, onDelete }) => {
//   const [memberNames, setMemberNames] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newTeamName, setNewTeamName] = useState(team.teamName);
//   const [selectedMembers, setSelectedMembers] = useState([]);

//   useEffect(() => {
//     const fetchMemberNames = async () => {
//       const namePromises = team.members.map(async (memberId) => {
//         const memberDoc = await getDoc(doc(db, 'user', memberId));
//         return memberDoc.exists() ? { id: memberId, name: memberDoc.data().name } : { id: memberId, name: 'Unknown Member' }; // Fallback if user doesn't exist
//       });
//       const names = await Promise.all(namePromises);
//       setMemberNames(names);
//       setSelectedMembers(team.members); // Initialize selected members for editing
//     };

//     fetchMemberNames();
//   }, [team.members]);

//   const isLeader = team.teamLeader === userId; // Check if the current user is the team leader
//   const role = isLeader ? 'Team Leader' : team.members.includes(userId) ? 'Member' : 'Not a Member'; // Determine role

//   const handleEdit = async () => {
//     if (!newTeamName || selectedMembers.length === 0) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Please provide a team name and select at least one member',
//       });
//       return;
//     }

//     try {
//       const teamRef = doc(db, 'teams', team.id);
//       await updateDoc(teamRef, {
//         teamName: newTeamName,
//         members: selectedMembers, // Update members
//       });
//       Swal.fire({
//         title: 'Team Updated Successfully!',
//         icon: 'success',
//       });
//       setIsEditing(false); // Exit editing mode
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error updating team',
//         text: error.message,
//       });
//     }
//   };

//   const handleDelete = async () => {
//     const confirmDelete = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You won’t be able to revert this!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'No, keep it',
//     });
  
//     if (confirmDelete.isConfirmed) {
//       try {
//         await deleteDoc(doc(db, 'teams', team.id)); // Ensure db is correctly imported
//         onDelete(team.id); // Call onDelete prop to remove the card from the dashboard
//         Swal.fire('Deleted!', 'Your team has been deleted.', 'success');
//       } catch (error) {
//         Swal.fire('Error!', error.message, 'error');
//       }
//     }
//   };

//   return (
//     <div className="team-card">
//       <h2>{isEditing ? <input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} /> : team.teamName}</h2>
//       <p><strong>Your Role:</strong> {role}</p>
//       <h4>Members:</h4>
//       <ul>
//         {memberNames.map((member) => (
//           <li key={member.id}>{member.name}</li>
//         ))}
//       </ul>
//       <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Save' : 'Edit'}</button>
//       <button onClick={handleDelete}>Delete</button>
//       {isEditing && (
//         <div>
//           <h4>Select Members:</h4>
//           {team.members.map((memberId) => {
//             const member = memberNames.find((name) => name.id === memberId);
//             return (
//               <div key={memberId}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectedMembers.includes(memberId)}
//                     onChange={() => setSelectedMembers(prev =>
//                       prev.includes(memberId)
//                         ? prev.filter(id => id !== memberId)
//                         : [...prev, memberId]
//                     )}
//                   />
//                   {member ? member.name : 'Unknown Member'} {/* Handle missing members gracefully */}
//                 </label>
//               </div>
//             );
//           })}
//           <button onClick={handleEdit}>Update Team</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeamCard;