import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header      from './components/Header';
import Status      from './components/Status';
import Navigation  from './components/Navigation';
import Footer      from './components/Footer';

import Home        from './pages/Home';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Teams       from './pages/Teams';
import Projects    from './pages/Projects';
import Profile     from './pages/Profile';

import UserProfile from './pages/UserProfile';
import Users         from './pages/Users';
import CreateTeam    from './pages/CreateTeam';
import EditTeam      from './pages/EditTeam';
import CreateProject from './pages/CreateProject';
import EditProject   from './pages/EditProject';

import { isAuthenticated } from './services/auth';
import Protected           from './components/Protected';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <Status/>
      <Navigation />

      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/teams"
            element={<PrivateRoute><Teams /></PrivateRoute>}
          />
          <Route
            path="/projects"
            element={<PrivateRoute><Projects /></PrivateRoute>}
          />
          <Route
            path="/profile"
            element={<PrivateRoute><Profile /></PrivateRoute>}
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* Manager/Admin only routes */}
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Protected allow={['admin', 'manager']}>
                  <Users />
                </Protected>
              </PrivateRoute>
            }
          />
          <Route
            path="/teams/new"
            element={
              <PrivateRoute>
                <Protected allow={['admin', 'manager']}>
                  <CreateTeam />
                </Protected>
              </PrivateRoute>
            }
          />
          <Route
            path="/teams/:id/edit"
            element={
              <PrivateRoute>
                <Protected allow={['admin', 'manager']}>
                  <EditTeam />
                </Protected>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <PrivateRoute>
                <Protected allow={['admin', 'manager']}>
                  <CreateProject />
                </Protected>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <PrivateRoute>
                <Protected allow={['admin', 'manager']}>
                  <EditProject />
                </Protected>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}