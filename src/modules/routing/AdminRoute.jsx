import { useAuth } from "../../context/authContext";
import { Navigate, Outlet } from "react-router-dom";

export function AdminRoute() {
  const { user } = useAuth();

  if (!user.isAdmin) {
    return <Navigate to="/employees/dashboard" />;
  }

  return <Outlet />;
}
