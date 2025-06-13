import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../services/helpers';
import { canManage } from '../services/role';

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
        <button> { canManage() && <Link to={`/teams/new`}>+ Krijo ekip</Link> }</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Leader</th>
            <th>Members</th>
            <th>Created</th>
            <th>Action</th>

            
          </tr>
        </thead>
        <tbody>
          {teams.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.leader?.username}</td>
              <td>{t.members.length}</td>
              <td>{formatDate(t.createdAt)}</td>
               { canManage() && <Link to={`/teams/${t._id}/edit`}>✏️ Edit</Link> }
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}