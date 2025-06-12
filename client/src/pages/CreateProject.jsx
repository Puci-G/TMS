import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateProject() {
  const navigate = useNavigate();
  const [teams, setTeams]   = useState([]);
  const [form, setForm]     = useState({
    title: '', description: '', team: '', deadline: '', priority: 'medium'
  });
  const [error, setError]   = useState('');

  useEffect(() => {
    api.get('/teams')
       .then(r => setTeams(r.data.teams))
       .catch(() => setError('Failed to load teams'));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    }
  }

  return (
    <section>
      <h2>Create Project</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <label>Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            required
          />
        </label>
        <label>Team
          <select name="team" value={form.team} onChange={onChange} required>
            <option value="">-- select team --</option>
            {teams.map(t => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label>Deadline
          <input type="date" name="deadline" value={form.deadline} onChange={onChange} required />
        </label>
        <label>Priority
          <select name="priority" value={form.priority} onChange={onChange}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="urgent">urgent</option>
          </select>
        </label>
        <button type="submit">Create</button>
      </form>
    </section>
  );
}
