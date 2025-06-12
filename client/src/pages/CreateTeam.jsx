import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [users, setUsers]   = useState([]);
  const [form, setForm]     = useState({
    name: '', description: '', leaderId: '', memberIds: []
  });
  const [error, setError]   = useState('');

  /* fetch user list once */
  useEffect(() => {
    api.get('/users')
       .then(r => setUsers(r.data.users))
       .catch(() => setError('Failed to load users'));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMembers = e =>
    setForm({
      ...form,
      memberIds: [...e.target.selectedOptions].map(o => o.value),
    });

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/teams', form);
      navigate('/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    }
  }

  return (
    <section>
      <h2>Create Team</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <label>Name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>

        <label>Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
          />
        </label>

        <label>Leader
          <select
            name="leaderId"
            value={form.leaderId}
            onChange={onChange}
            required
          >
            <option value="">-- pick user --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </label>

        <label>Members (Ctrl/Cmd + Click)
          <select multiple value={form.memberIds} onChange={handleMembers}>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Create</button>
      </form>
    </section>
  );
}
