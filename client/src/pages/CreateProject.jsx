import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateProject() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    team: '',
    deadline: '',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ngarko listën e teams */
  useEffect(() => {
    api
      .get('/teams')
      .then((r) => {
        setTeams(r.data.teams);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load teams');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/projects', form);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    }
  }

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h2>Create Project</h2>
        <Link to="/projects" className="btn btn-secondary">
          ← Back to Projects
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="auth-section">
        <form onSubmit={submit}>
          <label>
            Title *
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Description *
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Team *
            <select
              name="team"
              value={form.team}
              onChange={onChange}
              required
            >
              <option value="">-- select team --</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Deadline *
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Priority
            <select
              name="priority"
              value={form.priority}
              onChange={onChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
            <Link to="/projects" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
