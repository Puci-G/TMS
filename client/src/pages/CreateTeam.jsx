import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    leaderId: '',
    memberIds: [],
  });

  /* ngarko users */
  useEffect(() => {
    api
      .get('/users')
      .then((r) => {
        setUsers(r.data.users);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMembers = (e) =>
    setForm({
      ...form,
      memberIds: [...e.target.selectedOptions].map((o) => o.value),
    });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/teams', form);
      navigate('/teams');
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
        <h2>Create Team</h2>
        <Link to="/teams" className="btn btn-secondary">
          ← Back to Teams
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="auth-section">
        <form onSubmit={submit}>
          <label>
            Name *
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={onChange}
            />
          </label>

          <label>
            Leader *
            <select
              name="leaderId"
              value={form.leaderId}
              onChange={onChange}
              required
            >
              <option value="">-- pick user --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username}
                </option>
              ))}
            </select>
          </label>

          <label>
            Members (Ctrl/Cmd + Click)
            <select multiple value={form.memberIds} onChange={handleMembers}>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username}
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
            <Link to="/teams" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
