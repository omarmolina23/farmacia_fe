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
import FilterStatus from "../../components/FilterStatus.jsx";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [filterStatus]);

  const setCategoryIndex = (category, index) => {
    return { ...category, index };
  };

  const fetchCategories = async () => {
    try {
      const categories = await getCategoryAll();

      if (!Array.isArray(categories)) return;

      setCategories(
        categories
          .filter((category) => category.status == filterStatus)
          .map(setCategoryIndex)
      );
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
      setCategories(results.map(setCategoryIndex));
    } catch {
      toast.error("Error en la búsqueda de categorías");
    }
  };

  const handleCategoryRegister = () => {
    navigate("/admin/category/register");
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortConfig.key) {
      const transformValue = (value) =>
        typeof value === "string" ? value.toLowerCase() : value;

      const valueA = transformValue(a[sortConfig.key]);
      const valueB = transformValue(b[sortConfig.key]);

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
          title="Crear categoría"
          color="bg-[#8B83BA]"
          onClick={handleCategoryRegister}
          className="w-full md:w-auto"
        />
      </div>

      <FilterStatus
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="w-full overflow-x-aut">
        <table className="text-sm w-full min-w-[600px]">
          <thead className="p-5 bg-[#95A09D] text-left">
            <tr className="h-9">
              <th>
                <div
                  onMouseEnter={() => setHoverColumn("index")}
                  onMouseLeave={() => setHoverColumn(null)}
                  onClick={() => handleSort("index")}
                  className="cursor-pointer flex items-center gap-2 p-2 ml-4 w-16"
                >
                  Nº
                  {(hoverColumn === "index" || sortConfig.key === "index") &&
                    (sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
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
            {paginatedCategories.map((category) => (
              <CategoryTable
                key={category.id}
                id={category.id}
                index={category.index}
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
