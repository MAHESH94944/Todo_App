import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) {
    window.location.hash = "#/login";
    return null;
  }
  return children;
};

export default ProtectedRoute;
