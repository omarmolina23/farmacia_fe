import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./modules/routing/ProtectedRoute";
import Login from "./pages/login/Login";
import ResetPassword from "./pages/login/ResetPassword";
import AdminHome from "./pages/admin/AdminHome";
import SupplierRegister from "./pages/supplier/SupplierRegister";
import EmployeesHome from "./pages/employees/EmployeesHome";
import "./App.css";
import { AdminRoute } from "./modules/routing/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>

            <Route element={<AdminRoute />}>
              <Route path="/inicio/*" element={<AdminHome />} />

            </Route>
            
            <Route path="/employees-inicio/" element={<EmployeesHome />} />
          </Route>
          <Route path="/supplier-register/" element={<SupplierRegister />} />
          <Route path="/reset-password/" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
