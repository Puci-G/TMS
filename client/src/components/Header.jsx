import React from 'react';
import {isAdmin} from '../services/role'

export default function Header() {
  return (
    <header className="header">
      <h1>Team Management System </h1>
       { isAdmin()   && <h2 className="badge">ADMIN</h2> }
    </header>
  );
}