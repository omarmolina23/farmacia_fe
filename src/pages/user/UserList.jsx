import { useEffect, useState } from "react";
import UserLayout from "../../modules/admin/user/layout/UserLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import UserTable from "../../modules/admin/user/components/UserTable.jsx";
import Pagination from "../../components/Pagination"; // Importa el componente de paginación
import { getUserAll, searchUser } from "../../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsOptions = [10, 15, 20, 25, 30, 50];

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    getUserAll()
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("La respuesta no es un array");
        }
      })
      .catch((error) => {
        toast.error("Error al obtener usuarios");
      });
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchUsers();
      return;
    }

    try {
      const results = await searchUser(query);
      setUsers(results);
    } catch (error) {
      toast.error("Error en la búsqueda de usuarios");
    }
  };

  const handleUserRegister = () => {
    navigate("/admin/user/register");
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const birthDate = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Paginación: dividir la lista en páginas
  const paginatedUsers = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <UserLayout title="Usuarios">
      <div className="w-full bg-white p-3 flex justify-between items-center border-none">
        <SearchBar
          placeholder="Buscar un usuario"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button title="Registrar usuario" color="bg-[#8B83BA]" onClick={handleUserRegister} />
      </div>

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
          {paginatedUsers.map((user, index) => (
            <UserTable
              key={user.id}
              id={user.id}
              name={user.name}
              phone={user.phone}
              email={user.email}
              age={calculateAge(user.birthdate)}
              status={user.status}
            />
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsOptions={rowsOptions}
      />
    </UserLayout>
  );
};

export default UserList;
