import { IoIosArrowDropright, IoIosArrowDropdown } from "react-icons/io";
import { parseCurrency } from "../../../lib/utils";
import { ReceiptIcon } from "lucide-react";

const PurchaseRow = ({
  purchase,
  isExpanded,
  onToggleExpand,
  handleShowPdf,
}) => {
  return (
    <>
      <tr className="text-left h-10 border-b bg-gray-50">
        <td
          aria-expanded={isExpanded}
          onClick={() => onToggleExpand(!isExpanded)}
          className="cursor-pointer pl-4 transition-transform duration-200 align-middle"
        >
          {isExpanded ? (
            <IoIosArrowDropdown size={22} className="text-green-600" />
          ) : (
            <IoIosArrowDropright size={22} className="text-gray-500" />
          )}
        </td>
        <td className="text-left pl-6">{purchase.id}</td>
        <td>
          {new Date(purchase.date).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td>{purchase.amount_final}</td>
        <td>{parseCurrency(purchase.total)}</td>

        <td>
          <div className="flex justify-center">
            <button onClick={() => handleShowPdf(purchase.id)}>
              <ReceiptIcon />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b bg-gray-100">
          <td colSpan="6" className="pb-2 px-4">
            <div className="mt-2 overflow-x-auto rounded border border-gray-300 shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#95A09D] text-[#1D1D1D]">
                    <th scope="col" className="text-center">
                      Producto
                    </th>
                    <th scope="col" className="text-center">
                      Precio
                    </th>
                    <th scope="col" className="text-center">
                      Cantidad
                    </th>
                    <th scope="col" className="text-center">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.products.map((producto) => (
                    <tr key={producto.id} className="border-t text-gray-700">
                      <td className="text-center">{producto.products.name}</td>
                      <td className="text-center">{producto.products.price}</td>
                      <td className="text-center">{producto.amount}</td>
                      <td className="text-center">
                        {parseCurrency(
                          producto.amount * producto.products.price
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default PurchaseRow;
