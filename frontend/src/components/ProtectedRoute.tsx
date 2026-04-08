import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "PENDING" && location.pathname !== "/pending") {
    return <Navigate to="/pending" replace />;
  }
  
  if (user.role !== "PENDING" && location.pathname === "/pending") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
