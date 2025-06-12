import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { isAdmin } from '../services/role';

export default function Users() {
  const [users, setUsers]   = useState([]);
  const [editRole, setEdit] = useState(null);   // user being promoted/demoted
  const [error, setError]   = useState('');
  const navigate            = useNavigate();

  /* fetch on mount */
  useEffect(() => {
    api.get('/users')
       .then(res => setUsers(res.data.users))
       .catch(() => setError('Failed to load users'));
  }, []);

  /* delete user */
  async function del(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert('Delete failed');
    }
  }

  /* save new role */
  async function saveRole(role) {
    try {
      await api.put(`/users/${editRole._id}/role`, { role });
      setUsers(users.map(u => (u._id === editRole._id ? { ...u, role } : u)));
      setEdit(null);
    } catch {
      alert('Role update failed');
    }
  }

  /* table rows */
  const cols = ['Username', 'Email', 'Role', 'Actions'];
  const rows = users.map(u => (
    <>
      <td>{u.username}</td>
      <td>{u.email}</td>
      <td>{u.role}</td>
      <td>
        <button onClick={() => navigate(`/profile/${u._id}`)}>👁</button>
        {isAdmin() &&<button onClick={() => del(u._id)}>🗑</button>}
        {isAdmin() && <button onClick={() => setEdit(u)}>⚡</button>}
      </td>
    </>
  ));

  return (
    <section>
      <h2>Users</h2>
      {error && <p className="error">{error}</p>}
      <Table cols={cols} rows={rows} />

      {editRole && (
        <Modal onClose={() => setEdit(null)}>
          <h3>Change role for {editRole.username}</h3>
          <select
            defaultValue={editRole.role}
            onChange={e => saveRole(e.target.value)}
          >
            <option value="member">member</option>
            <option value="manager">manager</option>
            <option value="admin">admin</option>
          </select>
        </Modal>
      )}
    </section>
  );
}
