import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./modules/routing/ProtectedRoute";
import { AdminRoute } from "./modules/routing/AdminRoute";
import Loading from "./components/Loading";
import "./App.css";
import Catalog from "./pages/clients/catalog/Catalog";
import Product from "./pages/clients/catalog/Product";

const Login = lazy(() => import("./pages/login/Login"));
const ResetPassword = lazy(() => import("./pages/login/ResetPassword"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const CategoryList = lazy(() => import("./pages/category/CategoryList"));
const CategoryRegister = lazy(() =>
  import("./pages/category/CategoryRegister")
);
const CategoryUpdate = lazy(() => import("./pages/category/CategoryUpdate"));
const SupplierRegister = lazy(() =>
  import("./pages/supplier/SupplierRegister")
);
const SupplierList = lazy(() => import("./pages/supplier/SupplierList"));
const SupplierUpdate = lazy(() => import("./pages/supplier/SupplierUpdate"));
const ProductRegister = lazy(() => import("./pages/products/ProductRegister"));
const ProductList = lazy(() => import("./pages/products/ProductList"));
const ProductUpdate = lazy(() => import("./pages/products/ProductUpdate"));
const ProductDetail = lazy(() => import("./pages/products/ProductDetail"));
const BatchList = lazy(() => import("./pages/batch/BatchList"));
const BatchRegister = lazy(() => import("./pages/batch/BatchRegister"));
const UserList = lazy(() => import("./pages/user/UserList"));
const UserRegister = lazy(() => import("./pages/user/UserRegister"));
const UserUpdate = lazy(() => import("./pages/user/UserUpdate"));
const EmployeesHome = lazy(() => import("./pages/employees/EmployeesHome"));
const ClientHome = lazy(() => import("./pages/clients/ClientHome"));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<ClientHome />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin">
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="category">
                  <Route path="register" element={<CategoryRegister />} />
                  <Route path="list" element={<CategoryList />} />
                  <Route path="update" element={<CategoryUpdate />} />
                </Route>
                <Route path="supplier">
                  <Route path="register" element={<SupplierRegister />} />
                  <Route path="list" element={<SupplierList />} />
                  <Route path="update" element={<SupplierUpdate />} />
                </Route>
                <Route path="user">
                  <Route path="register" element={<UserRegister />} />
                  <Route path="list" element={<UserList />} />
                  <Route path="update/:id" element={<UserUpdate />} />
                </Route>
                <Route path="product">
                  <Route path="register" element={<ProductRegister />} />
                  <Route path="list" element={<ProductList />} />
                  <Route path="update/:id" element={<ProductUpdate />} />
                  <Route path="detail/:id" element={<ProductDetail />} />
                  <Route path="batch/:id" element={<BatchList />} />
                  <Route
                    path="batch/register/:id"
                    element={<BatchRegister />}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="/employees/home" element={<EmployeesHome />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
