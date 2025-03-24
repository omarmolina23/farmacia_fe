import { useEffect, useState } from "react";
import UserLayout from "../../modules/admin/user/layout/UserLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import UserTable from "../../modules/admin/user/components/UserTable.jsx";
import { getSupplierAll, searchSupplier } from "../../services/SupplierService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const mockData = [
      {
        id: 1093,
        name: "Juan Pérez",
        phone: "3012345678",
        email: "juan@example.com",
        age: 30,
        status: "Activo",
      },
      {
        id: 1094,
        name: "María Gómez",
        phone: "3123456789",
        email: "maria@example.com",
        age: 25,
        status: "Inactivo",
      },
      {
        id: 1095,
        name: "Carlos López",
        phone: "3009876543",
        email: "carlos@example.com",
        age: 40,
        status: "Activo",
      },
    ];
    setUsers(mockData);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchUsers();
      return;
    }

    try {
      const results = await searchSupplier(query);
      setUsers(results);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      toast.error("Error en la búsqueda de usuarios");
    }
  };

  const handleUserRegister = () => {
    navigate("/user-register");
  };

  return (
    <UserLayout title="Usuarios">
      <div className="w-full bg-white p-3 flex justify-between items-center border-none">
        <SearchBar
          placeholder="Buscar un usuario"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button
          title="Registrar usuario"
          color="bg-[#8B83BA]"
          onClick={handleUserRegister}
        />
      </div>
      <div className="bg-[#D0F25E] p-5 h-6 w-full"></div>
      <table className="text-sm w-full">
        <thead className="p-5 bg-[#95A09D] text-left">
          <tr className="h-9">
            <th className="pl-5">Cédula</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo electrónico</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserTable
              key={index}
              id={user.id}
              index={index}
              name={user.name}
              phone={user.phone}
              email={user.email}
              age={user.age}
              status={user.status}
            />
          ))}
        </tbody>
      </table>
    </UserLayout>
  );
};

export default UserList;
