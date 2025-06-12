import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditProject() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get(`/projects/${id}`)
       .then(r => setProject(r.data.project))
       .catch(() => setError('Failed to load project'));
  }, [id]);

  if (!project) return <p>Loading…</p>;

  const onChange = e =>
    setProject({ ...project, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, {
        title: project.title,
        description: project.description,
        status: project.status,
        priority: project.priority,
        deadline: project.deadline,
        progress: project.progress,
      });
      navigate('/projects');
    } catch {
      setError('Update failed');
    }
  }

  return (
    <section>
      <h2>Edit Project</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={save}>
        <label>Title
          <input name="title" value={project.title} onChange={onChange} />
        </label>
        <label>Description
          <textarea
            name="description"
            value={project.description}
            onChange={onChange}
          />
        </label>
        <label>Status
          <select name="status" value={project.status} onChange={onChange}>
            <option value="planning">planning</option>
            <option value="in-progress">in-progress</option>
            <option value="review">review</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>
        <label>Priority
          <select name="priority" value={project.priority} onChange={onChange}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="urgent">urgent</option>
          </select>
        </label>
        <label>Deadline
          <input type="date" name="deadline" value={project.deadline?.slice(0,10)} onChange={onChange}/>
        </label>
        <label>Progress (%)
          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={project.progress}
            onChange={onChange}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </section>
  );
}
