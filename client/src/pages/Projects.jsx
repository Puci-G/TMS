import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../services/helpers';
import { canManage } from '../services/role';

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
      <button> { canManage() && <Link to={`/projects/new`}>+ Krijo projekt</Link> }</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Team</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Actions</th>         

          </tr>
        </thead>
        <tbody>
        {projects.map(p => (
         <tr key={p._id}>
      <td>{p.title}</td>
      <td>{p.team?.name}</td>
      <td>{p.status}</td>
      <td>{formatDate(p.deadline)}</td>
      <td>
    { canManage() && <Link to={`/projects/${p._id}/edit`}>✏️ Edit</Link> }
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </section>
  );
}