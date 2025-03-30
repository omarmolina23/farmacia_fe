import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar.jsx";
import Button from "../../components/Button.jsx";
import Pagination from "../../components/Pagination.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  getCategoryAll,
  searchCategory,
} from "../../services/CategoryService.js";
import CategoryTable from "../../modules/admin/category/components/CategoryTable.jsx";
import CategoryLayout from "../../modules/admin/category/layout/CategoryLayout.jsx";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);

  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categories = await getCategoryAll();

      if (!Array.isArray(categories)) return;

      setCategories(categories);
    } catch {
      toast.error("Error al obtener categorías");
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchCategories();
      return;
    }

    try {
      const results = await searchCategory(query);
      setCategories(results);
    } catch {
      toast.error("Error en la búsqueda de categorías");
    }
  };

  const handleCategoryRegister = () => {
    navigate("/admin/category/register");
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <CategoryLayout title="Categorías">
      <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
        <SearchBar
          placeholder="Buscar categoría"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-auto"
        />
        <Button
          title="Registrar categoría"
          color="bg-[#8B83BA]"
          onClick={handleCategoryRegister}
          className="w-full md:w-auto"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="text-sm w-full min-w-[600px]">
          <thead className="p-5 bg-[#95A09D] text-left">
            <tr className="h-9">
              <th className="pl-5">Nº</th>
              <th
                onMouseEnter={() => setHoverColumn("name")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("name")}
                className="cursor-pointer flex items-center gap-2 p-2"
              >
                Nombre
                {(hoverColumn === "name" || sortConfig.key === "name") &&
                  (sortConfig.key === "name" &&
                  sortConfig.direction === "asc" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  ))}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category, index) => (
              <CategoryTable
                key={category.id}
                id={category.id}
                index={(currentPage - 1) * rowsPerPage + index}
                name={category.name}
                status={category.status}
                refreshList={fetchCategories}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={sortedCategories.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsOptions={rowsOptions}
      />
    </CategoryLayout>
  );
};

export default CategoryList;
