import { useEffect, useState } from "react";
import UserLayout from "../../modules/admin/user/layout/UserLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import UserTable from "../../modules/admin/user/components/UserTable.jsx";
import { getUserAll, searchUser, deleteUser } from "../../services/UserService";
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
    getUserAll()
      .then((data) => {
        if (Array.isArray(data)) {
          console.log(data);
          setUsers(data);
        } else {
          console.error("La respuesta no es un array");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
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
      console.error("Error en la búsqueda:", error);
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

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
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
              name={user.name}
              phone={user.phone}
              email={user.email}
              age={calculateAge(user.birthdate)}
              status={user.status}
            />
          ))}
        </tbody>
      </table>
    </UserLayout>
  );
};

export default UserList;
