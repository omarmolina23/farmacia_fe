import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminHome from "./pages/admin/AdminHome";
import EmployeesHome from "./pages/employees/EmployeesHome";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio/*" element={<AdminHome />} />
        <Route path="/employees-inicio/" element={<EmployeesHome />} />
      </Routes>
    </Router>
  );
}

export default App;
