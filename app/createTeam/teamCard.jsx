import React, { useState, useEffect } from 'react';
import { db, doc, updateDoc, deleteDoc, getDoc } from '../(database)/firebase-config';
import Swal from 'sweetalert2';
import './styles.css';

const TeamCard = ({ team, userId, onDelete }) => {
  const [memberNames, setMemberNames] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState(team.teamName);
  const [selectedMembers, setSelectedMembers] = useState(team.members);

  useEffect(() => {
    const fetchMemberNames = async () => {
      if (!Array.isArray(team.members)) {
        console.error("Expected team.members to be an array");
        return;
      }

      const namePromises = team.members.map(async (memberId) => {
        if (typeof memberId !== 'string') {
          console.error(`Expected memberId to be a string, got: ${typeof memberId}`);
          return { userId: memberId, name: 'Unknown Member' };
        }

        const memberDoc = await getDoc(doc(db, 'user', memberId));
        return memberDoc.exists()
          ? { userId: memberId, name: memberDoc.data().name }
          : { userId: memberId, name: 'Unknown Member' };
      });

      const names = await Promise.all(namePromises);
      setMemberNames(names);
      setSelectedMembers(team.members);
    };

    fetchMemberNames();
  }, [team.members]);

  const isLeader = team.teamLeader === userId;
  const role = isLeader 
    ? 'Team Leader' 
    : team.members.some(member => member.userId === userId) 
      ? 'Member' 
      : 'Not a Member';

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
        members: selectedMembers,
      });
      Swal.fire({
        title: 'Team Updated Successfully!',
        icon: 'success',
      });
      setIsEditing(false);
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
        await deleteDoc(doc(db, 'teams', team.id));
        onDelete(team.id);
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
        {selectedMembers.map(member => (
          <li key={member.userId}>{member.name}</li>
        ))}
      </ul>

      <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Save' : 'Edit'}</button>
      <button onClick={handleDelete}>Delete</button>

      {isEditing && (
        <div>
          <h4>Select Members:</h4>
          {team.members.map(member => (
            <div key={member.userId}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedMembers.some(selected => selected.userId === member.userId)}
                  onChange={() => setSelectedMembers(prev =>
                    prev.some(selected => selected.userId === member.userId)
                      ? prev.filter(selected => selected.userId !== member.userId)
                      : [...prev, member]
                  )}
                />
                {member.name}
              </label>
            </div>
          ))}
          <button onClick={handleEdit}>Update Team</button>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
