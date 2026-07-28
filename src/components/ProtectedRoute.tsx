import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { PageLoading } from "./shared/Loading";
import { useAuthStore } from "../stores/authStore";
import type { User } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: User["role"][];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <PageLoading label="Loading session..." />;
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
