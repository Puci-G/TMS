import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../services/helpers';

export default function Projects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data.projects))
      .catch(err => console.error(err));
  }, []);

  if (!projects) return <LoadingSpinner />;

  return (
    <section>
      <h2>Projects</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Team</th>
            <th>Status</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.team?.name}</td>
              <td>{p.status}</td>
              <td>{formatDate(p.deadline)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}