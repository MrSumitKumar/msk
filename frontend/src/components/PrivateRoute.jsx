// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (<Spinner />);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && Array.isArray(allowedRoles)) {
    const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());
    const userRole = user.role ? String(user.role).toLowerCase() : '';
    if (!normalizedAllowed.includes(userRole)) {
      // Redirect unauthorized users to their role dashboard (fallback to login/home)
      const roleRoute = userRole ? `/${userRole}-dashboard` : '/login';
      return <Navigate to={roleRoute} replace />;
    }
  }
  return children;
};

export default PrivateRoute;
