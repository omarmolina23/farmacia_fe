import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./modules/routing/ProtectedRoute";
import Login from "./pages/login/Login";
import ResetPassword from "./pages/login/ResetPassword";
import AdminHome from "./pages/admin/AdminHome";
import SupplierRegister from "./pages/supplier/SupplierRegister";
import SupplierList from "./pages/supplier/SupplierList";
import SupplierUpdate from "./pages/supplier/SupplierUpdate";
import EmployeesHome from "./pages/employees/EmployeesHome";
import "./App.css";
import { AdminRoute } from "./modules/routing/AdminRoute";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
          
            <Route element={<AdminRoute />}>
              <Route path="/inicio/*" element={<AdminHome />} />

            </Route>

            <Route path="/employees-inicio/" element={<EmployeesHome />} />
          </Route>
          <Route path="/supplier-register/" element={<SupplierRegister />} />
          <Route path="/supplier-list/" element={<SupplierList />} />
          <Route path="/supplier-update/" element={<SupplierUpdate />} />
          <Route path="/reset-password/" element={<ResetPassword />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
