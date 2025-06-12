import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <LoadingSpinner />;

  return (
    <section>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Teams:</strong> {user.teams.map(t => t.name).join(', ')}</p>
    </section>
  );
}