import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get('/teams')
    ])
    .then(([projectRes, teamsRes]) => {
      setProject(projectRes.data.project);
      setTeams(teamsRes.data.teams);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load project data');
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!project) return <div className="error">Project not found</div>;

  const onChange = e =>
    setProject({ ...project, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setError('');
    
    try {
      await api.put(`/projects/${id}`, {
        title: project.title,
        description: project.description,
        team: project.team,
        status: project.status,
        priority: project.priority,
        deadline: project.deadline,
        progress: project.progress,
      });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Edit Project: {project.title}</h2>
        <Link to="/projects" className="btn btn-secondary">
          ← Back to Projects
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      
      <div className="auth-section">
        <form onSubmit={save}>
          <label>
            Title *
            <input 
              name="title" 
              value={project.title || ''} 
              onChange={onChange} 
              required 
            />
          </label>
          
          <label>
            Description *
            <textarea
              name="description"
              value={project.description || ''}
              onChange={onChange}
              required
              rows="4"
            />
          </label>
          
          <label>
            Team
            <select name="team" value={project.team?._id || ''} onChange={onChange}>
              <option value="">-- Select team --</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          
          <label>
            Status
            <select name="status" value={project.status || 'planning'} onChange={onChange}>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          
          <label>
            Priority
            <select name="priority" value={project.priority || 'medium'} onChange={onChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          
          <label>
            Deadline
            <input 
              type="date" 
              name="deadline" 
              value={project.deadline?.slice(0,10) || ''} 
              onChange={onChange}
            />
          </label>
          
          <label>
            Progress (%)
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={project.progress || 0}
              onChange={onChange}
            />
          </label>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Save Changes
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