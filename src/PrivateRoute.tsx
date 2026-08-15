import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="text-center mt-5">Loading…</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
