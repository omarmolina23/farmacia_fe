import { useState } from "react";
import { IoIosArrowDropright, IoIosArrowDropdown, IoIosSend } from 'react-icons/io';
import { BsArrowReturnRight } from "react-icons/bs";
import LoadingOverlay from "../../../../components/LoadingOverlay"
import { FaCheckCircle, FaFileInvoice } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { sendElectronicInvoice } from "./invoice/electronic_invoice/sendElectronicInvoice";
import { updateSale, generatePdf } from "../../../../services/SalesService";

const SalesTable = ({
    index,
    id,
    number_e_invoice,
    fecha,
    cliente,
    vendedor,
    total,
    productos,
    isExpanded,
    repaid,
    onToggleExpand,
    reloadSales
}) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const handleSalesReturn = () => {
        navigate(`/admin/sales/return/${id}`);
    };
    const handleGenerateInvoice = async () => {
        try {
            const blob = await generatePdf(id);

            const pdfBlob = new Blob([blob], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
        } catch (error) {
            toast.error(error.message || "Error al generar el PDF");
        }
    }
    const handleElectronicInvoice = async () => {
        try {
            setStatus("loading");

            const productsToSend = productos.map(p => ({
                id: p.products.id,
                name: p.products.name,
                price: p.products.price,
                amount: p.amount
            }));

            // Declara aquí la variable response
            const response = await sendElectronicInvoice({
                fecha: fecha,
                cliente: cliente,
                productos: productsToSend
            });

            await updateSale(id, {
                bill_id: response.data.bill.id,
                number_e_invoice: response.data.bill.number,
                cufe: response.data.bill.cufe,
                qr_image: response.data.bill.qr_image,
            });

            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
            }, 2000);
            await reloadSales();
        } catch (error) {
            console.error('Error al facturar electrónicamente:', error);
            setStatus("idle");
        }
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
                <td className="px-4 py-2 align-middle">{fecha
                    ? new Date(fecha).toLocaleString("es-CO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "America/Bogota",
                    })
                    : ""}</td>
                <td className="px-4 py-2 align-middle">{cliente.name}</td>
                <td className="px-4 py-2 align-middle" >{vendedor}</td>
                <td className=" py- align-middle">${total?.toLocaleString()}</td>
                <td className="px-4 py-2 align-middle">
                    <div className="flex items-center gap-3 flex-wrap">
                        {repaid ? (
                            <div className="flex items-center gap-1 px-[6px] py-[2px] rounded-sm select-none cursor-default">
                                <BsCheckCircle size={22} className="text-green-600" />
                                <span className="text-[#181818]">Devuelto</span>
                            </div>
                        ) : (
                            <>
                                {/* Devolver venta */}
                                <div
                                    onClick={handleSalesReturn}
                                    title="Devolver venta"
                                    className="flex flex-col items-center cursor-pointer hover:bg-[#d5ffc3f2] w-fit px-[6px] py-[2px] rounded-sm"
                                >
                                    <BsArrowReturnRight size={23} className="text-[#181818]" />
                                    <span className="text-[10px] mt-1 md:hidden">Devolver</span>
                                </div>

                                {/* Facturar electrónicamente */}
                                {number_e_invoice === null || number_e_invoice === "null" ? (
                                    <div
                                        onClick={handleElectronicInvoice}
                                        title="Facturar electrónicamente"
                                        className="flex flex-col items-center cursor-pointer hover:bg-[#d5ffc3f2] w-fit px-[6px] py-[2px] rounded-sm"
                                    >
                                        <IoIosSend size={22} className="text-[#6B7280]" />
                                        <span className="text-[10px] mt-1 md:hidden">Facturar</span>
                                    </div>
                                ) : (
                                    <div
                                        title="Factura generada"
                                        className="flex flex-col items-center px-[6px] py-[2px] rounded-sm select-none cursor-default"
                                    >
                                        <FaCheckCircle size={22} className="text-green-600" />
                                        <span className="text-[10px] mt-1 md:hidden">Facturado</span>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Generar PDF */}
                        <div
                            onClick={handleGenerateInvoice}
                            title="Generar factura PDF"
                            className="flex flex-col items-center cursor-pointer hover:bg-[#d5ffc3f2] w-fit px-[6px] py-[2px] rounded-sm"
                        >
                            <FaFileInvoice size={22} color="#6B7280" />
                            <span className="text-[10px] mt-1 md:hidden">PDF</span>
                        </div>
                    </div>
                </td>
            </tr >
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
            )
            }
            {(status === "loading" || status === "success") && (
                <LoadingOverlay status={status} />
            )}
        </>
    );
};

export default SalesTable;
