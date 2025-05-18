import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import PurchaseRow from "./PurchaseRow";
import { useState } from "react";
import { useEffect } from "react";
import { generatePdf } from "../../../services/SalesService";
import { getSalesUser } from "../../../services/SalesService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";

export default function PurchaseTable({ purchases }) {
  const [calculatedPurchases, setCalculatedPurchases] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsOptions = [10, 15, 20, 25, 30, 50];

  useEffect(() => {
    setExpandedItems(purchases.map(() => false));
  }, [purchases]);

  useEffect(() => {
    setCalculatedPurchases(
      purchases.map((purchase) => {
        return {
          ...purchase,
          amount_final: Number(
            purchase.products.reduce(
              (acc, producto) => acc + producto.amount,
              0
            )
          ),
        };
      })
    );
  }, [purchases]);

  function toggleExpand(index) {
    setExpandedItems(
      expandedItems.map((item, i) => (i === index ? !item : item))
    );
  }

  const handleShowPdf = async (id) => {
    try {
      const blob = await generatePdf(id);

      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      toast.error(error.message || "Error al generar el PDF");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPurchases = [...calculatedPurchases].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    // Detectar si ambos valores son números (o pueden ser convertidos a número)
    const isNumeric =
      !isNaN(parseFloat(valueA)) &&
      isFinite(valueA) &&
      !isNaN(parseFloat(valueB)) &&
      isFinite(valueB);

    if (isNumeric) {
      return sortConfig.direction === "asc"
        ? parseFloat(valueA) - parseFloat(valueB)
        : parseFloat(valueB) - parseFloat(valueA);
    }

    // Ordenamiento alfabético para strings
    const strA = valueA?.toString().toLowerCase() || "";
    const strB = valueB?.toString().toLowerCase() || "";

    return sortConfig.direction === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  const paginatedPurchases = sortedPurchases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <table className="min-w-full text-sm rounded-lg overflow-hidden">
        <thead className="p-5 bg-[#95A09D] text-left">
          <tr className="h-9">
            <th className="pl-5"></th>
            <th className="pl-5">Nº Venta</th>
            <th
              className="cursor-pointer pl-2"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center gap-2">
                Fecha
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "asc" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  ))}
              </div>
            </th>
            <th
              className="cursor-pointer pl-2"
              onClick={() => handleSort("amount_final")}
            >
              <div className="flex items-center gap-2">
                Cantidad
                {sortConfig.key === "amount_final" &&
                  (sortConfig.direction === "asc" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  ))}
              </div>
            </th>
            <th
              className="cursor-pointer pl-2"
              onClick={() => handleSort("total")}
            >
              <div className="flex items-center gap-2">
                Total
                {sortConfig.key === "total" &&
                  (sortConfig.direction === "asc" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  ))}
              </div>
            </th>
            <th className="w-24 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPurchases.map(
            (purchase, i) => (
              (
                <PurchaseRow
                  key={purchase.id}
                  purchase={purchase}
                  isExpanded={expandedItems[i]}
                  onToggleExpand={() => {
                    toggleExpand(i);
                  }}
                  handleShowPdf={handleShowPdf}
                />
              )
            )
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={purchases.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsOptions={rowsOptions}
      />
    </div>
  );
}
