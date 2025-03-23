import { useAuth } from "../../context/authContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { user } = useAuth();

  console.log("user", user);
  if (!user && user.isActive) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
