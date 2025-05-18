import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import EmployeesLayout from "../../modules/employees/layouts/EmployeeLayout";
import SalesTable from "../../modules/admin/sales/components/SalesTable";
import FilterModal from "../../modules/admin/sales/components/FilterModal";
import { getSalesAll } from "../../services/SalesService";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

const SalesList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const navigate = useNavigate();

  const { user } = useAuth();
  const Layout = user?.isAdmin ? AdminLayout : EmployeesLayout;
  const Modulo = user?.isAdmin ? "admin" : "employees";

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = () => {
    getSalesAll()
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("data", data);
          setSales(data);
          setAllSales(data);
        } else {
          toast.error("Respuesta inesperada del servidor");
        }
      })
      .catch(() => {
        toast.error("Error al obtener ventas");
      });
  };

  const handleSaleRegister = () => {
    navigate(`/${Modulo}/sales/register`);
  };

  const handleToggleExpand = (saleId) => {
    setExpandedSaleId((prevId) => (prevId === saleId ? null : saleId));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSales(allSales);
      return;
    }

    const filtered = allSales.filter(
      (sale) =>
        sale.cliente.toLowerCase().includes(query) ||
        sale.vendedor.toLowerCase().includes(query)
    );
    setSales(filtered);
  };

  const handleApplyFilter = (filter) => {
    if (!filter) {
      setSales(allSales);
      return;
    }

    const { startDate, endDate } = filter;

    const filtered = allSales.filter((sale) => {
      const saleDate = new Date(sale.fecha);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });

    setSales(filtered);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSales = [...sales].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (sortConfig.key === "total") {
        return sortConfig.direction === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }

      const strA = valueA?.toString().toLowerCase() || "";
      const strB = valueB?.toString().toLowerCase() || "";

      return sortConfig.direction === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    }
    return 0;
  });

  const paginatedSales = sortedSales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Layout title="Ventas">
      <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
        <div className="flex w-full md:w-auto gap-3">
          <SearchBar
            placeholder="Buscar venta"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-white border-2 text-[#2B2644] flex items-center gap-2 font-semibold py-1.5 px-4 rounded-lg text-sm transition-all duration-300 ease-in-out hover:bg-opacity-80 focus:ring-2 focus:ring-gray-300 shadow-md active:scale-95"
          >
            <FaFilter className="text-[#8B83BA] text-xl" />
            Filtro
          </button>
        </div>
        <Button
          title="Registrar Venta"
          color="bg-[#8B83BA]"
          onClick={handleSaleRegister}
          className="w-full h-full"
        />
      </div>

      {isFilterOpen && (
        <FilterModal
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilter}
        />
      )}
      <div className="w-full bg-[#D0F25E] p-5 flex gap-4 flex-wrap justify-start"></div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="p-5 bg-[#95A09D] text-left">
            <tr className="h-9">
              <th className="pl-5"></th>
              <th className="pl-5">Nº</th>
              <th
                onMouseEnter={() => setHoverColumn("fecha")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("fecha")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Fecha
                  {(hoverColumn === "fecha" || sortConfig.key === "fecha") &&
                    (sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th
                onMouseEnter={() => setHoverColumn("cliente")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("cliente")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Cliente
                  {(hoverColumn === "cliente" ||
                    sortConfig.key === "cliente") &&
                    (sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th
                onMouseEnter={() => setHoverColumn("vendedor")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("vendedor")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Vendedor
                  {(hoverColumn === "vendedor" ||
                    sortConfig.key === "vendedor") &&
                    (sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th
                onMouseEnter={() => setHoverColumn("total")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("total")}
                className="cursor-pointer pl-2"
              >
                <div className="flex items-center gap-2">
                  Total
                  {(hoverColumn === "total" || sortConfig.key === "total") &&
                    (sortConfig.direction === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    ))}
                </div>
              </th>
              <th className="pl-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale, index) => (
              <SalesTable
                key={sale.id}
                index={(currentPage - 1) * rowsPerPage + index}
                id={sale.id}
                bill_id={sale.bill_id}
                fecha={new Date(sale.date).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "America/Bogota",
                })}
                cliente={sale.client}
                vendedor={sale.employeeName}
                total={sale.total}
                productos={sale.products}
                isExpanded={expandedSaleId === sale.id}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={sortedSales.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsOptions={rowsOptions}
      />
    </Layout>
  );
};

export default SalesList;
