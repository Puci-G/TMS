import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getRole } from '../services/role';

export default function EditTeam() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [team, setTeam]     = useState(null);
  const [error, setError]   = useState('');

  /* load team once */
  useEffect(() => {
    api.get(`/teams/${id}`)
       .then(r => setTeam(r.data.team))
       .catch(() => setError('Failed to load team'));
  }, [id]);

  if (!team) return <p>Loading…</p>;

  /* permissions: admin / manager / team leader */
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
  const allowed =
    ['admin', 'manager'].includes(getRole()) ||
    team.leader._id === userId;

  if (!allowed) return <p>403 – not allowed to edit this team</p>;

  /* handle edits */
  const onChange = e => setTeam({ ...team, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    try {
      await api.put(`/teams/${id}`, {
        name: team.name,
        description: team.description,
        status: team.status,
      });
      navigate('/teams');
    } catch {
      setError('Update failed');
    }
  }

  return (
    <section>
      <h2>Edit Team</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={save}>
        <label>Name
          <input
            name="name"
            value={team.name}
            onChange={onChange}
            required
          />
        </label>
        <label>Description
          <textarea
            name="description"
            value={team.description}
            onChange={onChange}
          />
        </label>
        <label>Status
          <select name="status" value={team.status} onChange={onChange}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
    </section>
  );
}
