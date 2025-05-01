import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BatchLayout from "../../modules/admin/batch/layout/BatchLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import BatchTable from "../../modules/admin/batch/components/BatchTable.jsx";
import Pagination from "../../components/Pagination";
import {
  getBatchesByProductId,
  searchBatchByNumber,
} from "../../services/BatchService.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import FilterStatus from "../../components/FilterStatus";

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoverColumn, setHoverColumn] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  const rowsOptions = [10, 15, 20, 25, 30, 50];
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, [filterStatus]);

  const fetchBatches = () => {
    getBatchesByProductId(id)
      .then((data) => {
        if (Array.isArray(data)) {
          const filteredBatches = data.filter(
            (batch) => batch.status === filterStatus
          );
          setBatches(filteredBatches);
        }
      })
      .catch(() => {
        toast.error("Error al obtener lotes");
      });
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchBatches();
      return;
    }

    try {
      const results = await searchBatchByNumber(query);
      setBatches(results);
    } catch (error) {
      toast.error("Error en la búsqueda de lotes");
    }
  };

  const handleBatchRegister = () => {
    navigate("/admin/product/batch/register/" + id);
  };


  const sortedBatches = [...batches].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const paginatedBatches = sortedBatches.slice(
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
    <BatchLayout title="Lotes">
      <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
        <SearchBar
          placeholder="Buscar un lote"
          value={searchQuery}
          onChange={handleSearch}
        />{" "}
        <Button
          title="Registrar lote"
          color="bg-[#8B83BA]"
          onClick={handleBatchRegister}
        />{" "}
      </div>

      <FilterStatus
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="overflow-x-auto w-full">
        <table className="text-sm w-full min-w-[700px] border-collapse">
          <thead className="bg-[#95A09D] text-left">
            <tr className="h-9">
              <th className="pl-4">#</th>
              <th className="pl-4">Número lote</th>
              <th className="pl-4">Cantidad</th>
              <th className="pl-4">Valor total</th>
              <th className="pl-4">Proveedor</th>
              <th className="pl-4">Fecha de entrada</th>
              <th className="pl-4">Fecha de vencimiento</th>
              <th className="pl-4">Expirado</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBatches.map((batch, index) => (
              <BatchTable
                key={batch.id}
                index={index}
                batch={batch}
                refreshList={fetchBatches}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={sortedBatches.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsOptions={rowsOptions}
      />
    </BatchLayout>
  );
};

export default BatchList;
