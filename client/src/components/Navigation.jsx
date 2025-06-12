import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/auth';
import { canManage} from '../services/role';

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      {isAuthenticated() ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/teams">Teams</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/profile">Profile</Link>
      
          { canManage() && <Link to="/teams/new">New Team</Link> }
          { canManage() && <Link to="/projects/new">New Project</Link> }
          { canManage() && <Link to="/users">Users</Link> }
<div style={{display: "flex", justifyContent: "flex-end"}}>
  <button onClick={handleLogout}>Logout</button>
</div>
     </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}