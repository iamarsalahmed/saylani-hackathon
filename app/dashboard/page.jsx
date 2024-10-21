'use client';
import React, { useState, useEffect } from 'react';
import { auth, signOut, db, collection, getDocs } from '../(database)/firebase-config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import TeamCard from '../createTeam/teamCard';
import './styles.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await fetchUserTeams(user.uid);
      } else {
        router.push('/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserTeams = async (userId) => {
    try {
      const teamsRef = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamsRef);

      if (teamSnapshot.empty) {
        console.log('No teams found in the database.');
        setTeams([]);
        return;
      }

      const fetchedTeams = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Fetched Teams:', fetchedTeams);

      const userTeams = fetchedTeams.filter(team => {
        const isMember = team.members.some(member => member.userId === userId);
        if (isMember) {
          console.log(`User ${userId} is a member of team ${team.teamName}`);
        } else {
          console.log(`User ${userId} is NOT a member of team ${team.teamName}`);
        }
        return isMember;
      });

      console.log('User Teams:', userTeams);
      setTeams(userTeams);
    } catch (error) {
      console.error('Error fetching user teams:', error);
    }
  };

  const handleDeleteTeam = (teamId) => {
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      Swal.fire({
        title: 'Signed Out Successfully!',
        icon: 'success',
      });
      router.push('/signin');
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error Signing Out',
        text: error.message,
      });
    });
  };

  const handleCreateTeam = () => {
    router.push('/createTeam');
  };

  return (
    <div className="dashboard">
      <h1>Welcome to your Dashboard, {user?.email}</h1>
      <div className="button-container">
        <button onClick={handleSignOut}>Sign Out</button>
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>

      <div className="team-cards-container">
        {teams.length > 0 ? (
          teams.map((team) => (
            <TeamCard key={team.id} team={team} userId={user.uid} onDelete={handleDeleteTeam} />
          ))
        ) : (
          <p>You are not part of any team.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
