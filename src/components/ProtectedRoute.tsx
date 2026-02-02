import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../stores/authStore";
import type { User } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: User["role"][];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
