import { useEffect, useState } from "react";
import UserLayout from "../../modules/admin/user/layout/UserLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import UserTable from "../../modules/admin/user/components/UserTable.jsx";
import Pagination from "../../components/Pagination";
import { getUserAll, searchUser } from "../../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import FilterStatus from "../../components/FilterStatus";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filterStatus]);

  const fetchUsers = () => {
    getUserAll()
      .then((data) => {
        if (Array.isArray(data)) {
          const filteredUsers = data.filter(user => user.status === filterStatus);
          const usersWithAge = filteredUsers.map(user => ({
            ...user,
            age: calculateAge(user.birthdate)
          }));
          setUsers(usersWithAge);
        }
      })
      .catch(() => {
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

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <UserLayout title="Usuarios">
      <div className="w-full bg-white p-3 flex justify-between items-center border-none">
        <SearchBar placeholder="Buscar un usuario" value={searchQuery} onChange={handleSearch} />
        <Button title="Registrar usuario" color="bg-[#8B83BA]" onClick={handleUserRegister} />
      </div>

      <FilterStatus filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      <table className="text-sm w-full">
        <thead className="p-5 bg-[#95A09D] text-left">
          <tr className="h-9">
            <th className="pl-5">Cédula</th>
            <th 
              onMouseEnter={() => setHoverColumn("name")}
              onMouseLeave={() => setHoverColumn(null)}
              onClick={() => handleSort("name")}
              className="cursor-pointer flex items-center gap-2 p-2"
            >
              Nombre
              {(hoverColumn === "name" || sortConfig.key === "name") && (
                sortConfig.key === "name" && sortConfig.direction === "asc" 
                ? <IoIosArrowUp />
                : <IoIosArrowDown />
              )}
            </th>
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
              refreshList={fetchUsers}
            />
          ))}
        </tbody>
      </table>

      <Pagination 
        currentPage={currentPage} 
        totalItems={sortedUsers.length} 
        rowsPerPage={rowsPerPage} 
        setCurrentPage={setCurrentPage} 
        setRowsPerPage={setRowsPerPage} 
        rowsOptions={rowsOptions}
      />
    </UserLayout>
  );
};

export default UserList;