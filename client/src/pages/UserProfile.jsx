import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UserProfile() {
  const { id }         = useParams();            // URL param
  const [user,setUser] = useState(null);
  const [error,setErr] = useState('');

  useEffect(()=>{
    api.get(`/users/${id}`)
       .then(res => setUser(res.data.user))
       .catch(err => {
         setErr(err.response?.data?.message || 'Error');
       });
  },[id]);

  if (error)   return <p className="error">{error}</p>;
  if (!user)   return <LoadingSpinner />;

  return (
    <section>
      <h2>Profile: {user.username}</h2>
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Teams:</strong> {user.teams.map(t=>t.name).join(', ')||'—'}</p>
    </section>
  );
}
