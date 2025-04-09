import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hook";
import { v4 as uuidv4 } from "uuid";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);
  const userRole = useAppSelector((state) => state.auth.role);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/chat" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
