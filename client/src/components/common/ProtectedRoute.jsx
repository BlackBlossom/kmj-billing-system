/**
 * Protected Route Component
 * Route guard for authenticated users
 */

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { PageLoader } from '../../components/common/Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const location = useLocation();

  // Show loading while checking auth state
  if (isAuthenticated === null) {
    return <PageLoader message="Loading..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Require admin but user is not admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;
