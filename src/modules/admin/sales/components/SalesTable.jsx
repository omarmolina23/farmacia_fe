import { IoIosArrowDropright, IoIosArrowDropdown } from 'react-icons/io';
import { sendCreditNote } from './invoice/credit_note/sendCreditNote';
import { BsArrowReturnRight } from "react-icons/bs";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SalesTable = ({
    index,
    id,
    bill_id,
    fecha,
    cliente,
    vendedor,
    total,
    productos = [],
    isExpanded,
    onToggleExpand,
}) => {
    const navigate = useNavigate();

    const saveInfo = () => {
        if (productos.length > 0) {
            const first = productos[0].products;
            localStorage.setItem("supplier", first.supplier.name);
            localStorage.setItem("category", first.category.name);
        }
    };

    // llamar dos funciones sendCreditNote y cambiarStatus venta

    const handleSalesReturn = () => {

        Swal.fire({
            customClass: {
                popup: "swal2-show",
                confirmButton: "bg-[#8B83BB] text-black",
                cancelButton: "bg-[#FFFFFF] text-black",
                icon: "text-mb mx-auto",
                title: "!font-semibold !mt-2 !text-gray-900 !text-mb !mx-auto",
                text: "!font-medium !text-gray-500 !text-mb !mx-auto",
            },
            title: `¿Devolver venta con referencia: ${id}'?`,
            text: "Esta acción cambiará el estado del producto",
            icon: "warning",
            showCancelButton: true,
            iconColor: "#000000",
            confirmButtonText: `Sí, devolver.`,
            cancelButtonText: "No, cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    saveInfo();
                    navigate(`/admin/sales/return/${id}`);
                    toast.success(`NotaCrédito creada con éxito.`);
                    refreshList();
                } catch (error) {
                    toast.error(`Error al crear la NotaCrédito`);
                }
            }
        });
    };

    return (
        <>
            <tr className="text-left h-10 border-b bg-gray-50">
                <td
                    aria-expanded={isExpanded}
                    onClick={() => onToggleExpand(id)}
                    className="cursor-pointer pl-4 transition-transform duration-200 align-middle"
                >
                    {isExpanded ? (
                        <IoIosArrowDropdown size={22} className="text-green-600" />
                    ) : (
                        <IoIosArrowDropright size={22} className="text-gray-500" />
                    )}
                </td>
                <td className="text-left pl-6">{index + 1}</td>
                <td>{fecha}</td>
                <td>{cliente.name}</td>
                <td>{vendedor}</td>
                <td>${total?.toLocaleString()}</td>
                <td className="pl-4 align-middle">
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:bg-[#be90d4f2] w-fit px-[6px] py-[2px] rounded-sm"
                        onClick={handleSalesReturn}
                    >
                        <BsArrowReturnRight size={16} className="text-[#181818]" />
                        <span className="hidden md:inline">Devolver</span>
                    </div>
                </td>

            </tr>

            {isExpanded && (
                <tr className="border-b bg-gray-100">
                    <td colSpan="7" className="pb-2 px-4">
                        <div className="mt-2 overflow-x-auto rounded border border-gray-300 shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-[#95A09D] text-[#1D1D1D]">
                                        <th scope="col" className="text-center">Producto</th>
                                        <th scope="col" className="text-center">Categoría</th>
                                        <th scope="col" className="text-center">Proveedor</th>
                                        <th scope="col" className="text-center">Cantidad</th>
                                        <th scope="col" className="text-center">Precio unitario</th>
                                        <th scope="col" className="text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((producto, i) => (
                                        <tr key={producto.id} className="border-t text-gray-700">
                                            <td className="text-center">{producto.products.name}</td>
                                            <td className="text-center">{producto.products.category.name}</td>
                                            <td className="text-center">{producto.products.supplier.name}</td>
                                            <td className="text-center">{producto.amount}</td>
                                            <td className="text-center">
                                                ${new Intl.NumberFormat('es-CO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(producto.products.price)}
                                            </td>

                                            <td className="text-center">
                                                ${new Intl.NumberFormat('es-CO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(producto.products.price * producto.amount)}
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

export default SalesTable;
