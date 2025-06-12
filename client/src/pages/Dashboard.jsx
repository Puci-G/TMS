import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  if (!user) return <LoadingSpinner />;

  return (
    <section>
      <h2>Dashboard</h2>
      <p>Welcome back, {user.firstName}!</p>
      <p>You are part of {user.teams.length} team(s).</p>
    </section>
  );
}