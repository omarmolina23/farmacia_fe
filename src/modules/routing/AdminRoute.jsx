import { useAuth } from "../../context/authContext";
import { Navigate, Outlet, Route } from "react-router-dom";

export function AdminRoute() {
  const { user } = useAuth();

  if (!user.isAdmin) {
    return <Navigate to="/employees-inicio" />;
  }

  return <Outlet />;
}
