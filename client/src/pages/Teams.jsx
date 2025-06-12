import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../services/helpers';

export default function Teams() {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    api.get('/teams')
      .then(res => setTeams(res.data.teams))
      .catch(err => console.error(err));
  }, []);

  if (!teams) return <LoadingSpinner />;

  return (
    <section>
      <h2>Teams</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Leader</th>
            <th>Members</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.leader?.username}</td>
              <td>{t.members.length}</td>
              <td>{formatDate(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}