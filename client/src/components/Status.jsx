import React from 'react';
import {isAdmin, isManager} from '../services/role'

export default function Header() {
  return (
  <div className="status">
  {isAdmin()   ? <h2 className="badge">ADMIN</h2>
  : isManager() ? <h2 className="badge">Manager</h2>
  :              <h2 className="badge">Member</h2>}
</div>

  );
}