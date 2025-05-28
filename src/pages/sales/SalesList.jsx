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
import { getSalesFiltered } from "../../services/SalesService";
import FilterRepaid from "../../components/FilterRepaid";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

const toColombianDateTimeRange = (dateString, isEnd = false) => {
  const date = new Date(dateString + (isEnd ? "T23:59:59" : "T00:00:00"));
  return new Date(date.toLocaleString("en-US", { timeZone: "America/Bogota" }));
};

const SalesList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  const [allSales, setAllSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(false);
  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const navigate = useNavigate();

  const { user } = useAuth();
  const Layout = user?.isAdmin ? AdminLayout : EmployeesLayout;
  const Modulo = user?.isAdmin ? "admin" : "employees";
  const [dateFilter, setDateFilter] = useState({ startDate: today, endDate: today, repaid: false, });
  const applyStatusFilter = (repaidValue, salesList = allSales) => { const filtered = salesList.filter(sale => sale.repaid === repaidValue); setSales(filtered); };


  useEffect(() => {
    applyStatusFilter(filterStatus);
  }, [filterStatus, allSales]);


  const fetchSales = async (filters = {}) => {
    try {
      const data = await getSalesFiltered({
        startDate: toColombianDateTimeRange(filters.startDate).toISOString(),
        endDate: toColombianDateTimeRange(filters.endDate, true).toISOString(),
        repaid: filters.repaid,
      });

      if (Array.isArray(data)) {
        setAllSales(data);
        setSales(data);
      } else {
        toast.error("Respuesta inesperada del servidor");
      }
    } catch {
      toast.error("Error al obtener ventas");
    }
  };

  const reloadSales = async () => {
    try {
      const data = await getSalesFiltered({
        startDate: toColombianDateTimeRange(dateFilter.startDate).toISOString(),
        endDate: toColombianDateTimeRange(dateFilter.endDate, true).toISOString(),
        repaid: filterStatus,
      });
      setAllSales(data);
      setSales(data);
    } catch {
      toast.error("Error al recargar ventas");
    }
  };


  useEffect(() => {
    fetchSales({
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate,
      repaid: filterStatus,
    });
  }, [filterStatus, dateFilter]);


  useEffect(() => {
    reloadSales();
  }, [filterStatus, dateFilter]);

  const handleSaleRegister = () => {
    navigate(`/${Modulo}/sales/register`);
  };

  const handleToggleExpand = (saleId) => {
    setExpandedSaleId((prevId) => {

      return prevId === saleId ? null : saleId;
    });
  };


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();

    setSearchQuery(query);

    if (query.trim() === "") {
      applyStatusFilter(filterStatus);
      return;
    }

    const filtered = allSales.filter(
      sale =>
        (sale.client.name.toLowerCase().includes(query) || sale.employeeName.toLowerCase().includes(query)) &&
        sale.repaid === filterStatus
    );

    setSales(filtered);
  };


  const handleApplyFilter = (filter) => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

    if (!filter) {
      setDateFilter({ startDate: today, endDate: today, repaid: false });
      return;
    }

    const { startDate, endDate, repaid } = filter;

    setDateFilter({
      startDate: startDate || today,
      endDate: endDate || today,
      repaid: typeof repaid === "boolean" ? repaid : false,
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSales = [...sales].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (sortConfig.key === "total") {
      return sortConfig.direction === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }

    if (sortConfig.key === "fecha") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === "asc"
        ? dateA - dateB
        : dateB - dateA;
    }

    // Para cliente y vendedor y otros strings
    const strA = (valueA || "").toString().toLowerCase();
    const strB = (valueB || "").toString().toLowerCase();

    return sortConfig.direction === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
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
      <FilterRepaid
        mode="sales"
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="p-5 bg-[#95A09D] text-left">
            <tr className="h-9">
              <th className=" pl-5"></th>
              <th className="pl-5">Nº</th>
              <th
                onMouseEnter={() => setHoverColumn("fecha")}
                onMouseLeave={() => setHoverColumn(null)}
                onClick={() => handleSort("fecha")}
                className="px-4 py-2 text-left align-middle"
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
                className="px-4 py-2 text-left align-middle"
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
                className="px-4 py-2 text-left align-middle"
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
                className="cpx-4 py-2 text-left align-middle"
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
              <th className="px-4 py-2 text-left align-middle">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale, index) => (
              <SalesTable
                key={sale.id}
                index={(currentPage - 1) * rowsPerPage + index}
                id={sale.id}
                reference_code={sale.reference_code}
                number_e_invoice={sale.number_e_invoice}
                fecha={new Date(sale.date)}
                cliente={sale.client}
                vendedor={sale.employeeName}
                total={sale.total}
                productos={sale.products}
                repaid={sale.repaid}
                isExpanded={expandedSaleId === sale.id}
                onToggleExpand={handleToggleExpand}
                reloadSales={reloadSales}
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
