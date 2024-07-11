import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Signup from './signup.js';
import Login from './login.js';
import Dashboard from './Dashboard.js';

const PrivateRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = !!userRole;
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return isAuthorized ? element : <Navigate to="/dashboard" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<Dashboard />} allowedRoles={['forumMember', 'volunteer', 'admin']} />} 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

