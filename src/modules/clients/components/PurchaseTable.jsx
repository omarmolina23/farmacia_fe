import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import PurchaseRow from "./PurchaseRow";
import { useState } from "react";
import { useEffect } from "react";
import Pagination from "../../../components/Pagination";

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
        const cantidad = purchase.productos
          .map((producto) => producto.cantidad)
          .reduce((total, value) => total + value);

        const total = purchase.productos
          .map((producto) => producto.cantidad * producto.price)
          .reduce((total, value) => total + value);

        return {
          ...purchase,
          cantidad,
          total,
        };
      })
    );
  }, [purchases]);

  function toggleExpand(index) {
    setExpandedItems(
      expandedItems.map((item, i) => (i === index ? !item : item))
    );
  }

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPurchases = [...calculatedPurchases].sort((a, b) => {
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

  const paginatedPurchases = sortedPurchases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <table className="min-w-full text-sm">
        <thead className="p-5 bg-[#95A09D] text-left">
          <tr className="h-9">
            <th className="pl-5"></th>
            <th className="pl-5">Nº Venta</th>
            <th
              className="cursor-pointer pl-2"
              onClick={() => handleSort("fecha")}
            >
              <div className="flex items-center gap-2">
                Fecha
                {sortConfig.key === "fecha" &&
                  (sortConfig.direction === "asc" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  ))}
              </div>
            </th>
            <th
              className="cursor-pointer pl-2"
              onClick={() => handleSort("cantidad")}
            >
              <div className="flex items-center gap-2">
                Cantidad
                {sortConfig.key === "cantidad" &&
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
          {paginatedPurchases.map((purchase, i) => (
            <PurchaseRow
              key={purchase.id}
              purchase={purchase}
              isExpanded={expandedItems[i]}
              onToggleExpand={() => {
                toggleExpand(i);
              }}
            />
          ))}
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
