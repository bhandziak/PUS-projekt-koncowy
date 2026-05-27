import React, { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from "../../../app/router/routePaths";
import { AuthContext } from '../../../app/providers/AuthProvider';

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) {
    return null;
  }

  const { accessToken, user } = authContext;

// 1. If user == null → is not logged
  if (!user || !accessToken) {
    return <Navigate to={ROUTES.UNAUTHORIZED} state={{ from: location }} replace />;
  }

  // 2. Logged, but unauthorized
  const hasRequiredRole = allowedRoles.some(
    (role) => role.toLowerCase() === user.role.toLowerCase()
  );

  if (!hasRequiredRole) {
    return <Navigate to={ROUTES.FORBIDDEN} state={{ from: location }} replace />;
  }

  // 3. OK
  return <Outlet />;
};

export default RequireAuth;