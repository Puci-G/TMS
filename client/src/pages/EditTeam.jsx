import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRole } from '../services/role';

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam]     = useState(null);
  const [members, setUsers] = useState([]);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Ngarkojmë të dhënat e team + listën e users në paralel */
    Promise.all([ api.get(`/teams/${id}`), api.get('/users') ])
      .then(([teamRes, userRes]) => {
        setTeam(teamRes.data.team);
        setUsers(userRes.data.users);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load team data');
        setLoading(false);
      });
  }, [id]);

  if (loading)   return <LoadingSpinner />;
  if (!team)     return <div className="error">Team not found</div>;

  /* Lejo vetëm admin, manager ose leader-in aktual */
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  const allowed =
    ['admin','manager'].includes(getRole()) ||
    team.leader._id === localUser._id;

    console.log("leader" ,team.leader._id);
        console.log("userid", localUser._id);


  if (!allowed) return <p>Not allowed to edit this team</p>;

  /* Handlers */
  const onChange = e =>
    setTeam({ ...team, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/teams/${id}`, {
        name:        team.name,
        description: team.description,
        status:      team.status
      });
      navigate('/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <section>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <h2>Edit Team: {team.name}</h2>
        <Link to="/teams" className="btn btn-secondary">
          ← Back to Teams
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="auth-section">
        <form onSubmit={save}>
          <label>
            Name *
            <input
              name="name"
              value={team.name || ''}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={team.description || ''}
              onChange={onChange}
              rows="3"
            />
          </label>

          <label>
            Status
            <select name="status" value={team.status || 'active'} onChange={onChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          {/* Fushë opsionale për të ndryshuar leader-in */}
          <label>
            Leader
            <select
              name="leader"
              value={team.leader?._id || ''}
              onChange={e =>
                setTeam({
                  ...team,
                  leader: e.target.value,
                })
              }
            >
              {members.map(m => (
                <option key={m._id} value={m._id}>
                  {m.username}
                </option>
              ))}
            </select>
          </label>

          <div style={{display:'flex', gap:'1rem'}}>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <Link to="/teams" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
