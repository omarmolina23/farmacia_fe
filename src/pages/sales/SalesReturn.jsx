import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "../../components/LoadingOverlay"
import NumberFlow from '@number-flow/react';
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import EmployeesLayout from "../../modules/employees/layouts/EmployeeLayout"
import SalesProduct from "../../modules/admin/sales/components/SalesProduct";
import { getSalesId } from "../../services/SalesService";
import Button from "../../components/Button";
import { returnSale, updateSale } from "../../services/SalesService";
import { sendCreditNote } from "../../modules/admin/sales/components/invoice/credit_note/sendCreditNote"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const SalesReturn = () => {
    const { sales_reference_id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const Layout = user?.isAdmin ? AdminLayout : EmployeesLayout;
    const Modulo = user?.isAdmin ? "admin" : "employees";
    const [products, setProducts] = useState([]);
    const [sale, setSale] = useState(null);
    const [precioTotal, setPrecioTotal] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [status, setStatus] = useState("idle");

    const calcularValorTotal = () => {
        const total = products.reduce((sum, p) => sum + p.totalPrice, 0);
        setPrecioTotal(total);
    };

    useEffect(() => {
        const saleBack = async () => {
            try {
                const sale = await getSalesId(sales_reference_id);
                setSale(sale);
                if (sale?.client) {
                    setClienteSeleccionado(sale.client);
                }

                if (sale?.products) {
                    const productosConvertidos = sale.products.map(p => {
                        const precioConIVA = p.products.price;
                        return {
                            ...p,
                            price: precioConIVA,
                            totalPrice: precioConIVA * p.amount,
                        };
                    });
                    setProducts(productosConvertidos);
                }

            } catch (error) {
                toast.error("Error al cargar datos de la venta simulada");
            }
        };
        saleBack();
    }, [sales_reference_id]);


    useEffect(() => {
        calcularValorTotal();
    }, [products]);

    const cancelarDevolucion = () => {
        navigate(`/${Modulo}/sales/list`);
    };
    const handleProductSelect = id => setSelectedProductId(prev => prev === id ? null : id);

    const devolverCompra = async e => {
        e.preventDefault();

        if (!sale) {
            toast.error("No se encontró la información de la venta");
            return;
        }

        const tieneFacturaElectronica = sale.number_e_invoice !== null && sale.number_e_invoice !== "null";

        const result = await Swal.fire({
            customClass: {
                popup: "swal2-show",
                confirmButton: "bg-[#8B83BB] text-black",
                cancelButton: "bg-[#FFFFFF] text-black",
                icon: "text-mb mx-auto",
                title: "!font-semibold !mt-2 !text-gray-900 !text-mb !mx-auto",
                text: "!font-medium !text-gray-500 !text-mb !mx-auto",
            },
            title: `¿Devolver venta con referencia: ${sale.id}?`,
            text: tieneFacturaElectronica
                ? "Esta acción generará una Nota Crédito."
                : "Esta venta no tiene factura electrónica. Se devolverán los productos al inventario pero no se generará Nota Crédito.",
            icon: "warning",
            showCancelButton: true,
            iconColor: "#000000",
            confirmButtonText: `Sí, devolver.`,
            cancelButtonText: "No, cancelar.",
        });

        if (!result.isConfirmed) return;

        try {
            setStatus("loading");

            const productsToReturn = sale.products.map((product) => ({
                id: product.id,
                nombre: product.products.name,
                cantidad: product.amount,
                precio: product.products.price,
            }));

            if (tieneFacturaElectronica) {
                
                const response = await sendCreditNote({
                    bill_id: sale.bill_id,
                    reference_code: sale.id,
                    productos: productsToReturn,
                });
                console.log("Nota de crédito generada:", response.data.credit_note.cude);
                await updateSale(sale.id, {
                    number_credit_note: response.data.credit_note.number,
                    cufe: response.data.credit_note.cude,
                    qr_image: response.data.credit_note.qr_image,
                });
                
                await returnSale(sale.id);

            } else {
                await returnSale(sale.id); // Solo devuelve sin generar nota crédito
            }

            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                navigate(`/${Modulo}/sales/list`);
            }, 2000);
        } catch (error) {
            toast.error("Error al devolver la venta");
            setStatus("idle");
        }
    };

    return (
        <Layout title="Registrar Venta">
            <div className="flex flex-col h-screen">
                <div className="flex-1 overflow-auto max-h-[330px]">
                    <table className="min-w-full text-sm table-fixed">
                        <thead className="sticky top-0 bg-[#95A09D] z-9 text-left">
                            <tr className="h-9">
                                <th></th>
                                <th>N°</th>
                                <th className="text-left">Nombre</th>
                                <th className="text-left">Categoria</th>
                                <th className="text-left">Proveedor</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-center">Precio Unitario</th>
                                <th className="text-center">Precio Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((producto, index) => (
                                <SalesProduct
                                    key={producto.products.id}
                                    numeroProducto={index + 1}
                                    name={producto.products.name}
                                    category={producto.products.category.name}
                                    supplier={producto.products.supplier.name}
                                    cantidad={producto.amount}
                                    price={producto.products.price}
                                    precioTotal={producto.totalPrice}
                                    isSelected={selectedProductId === producto.products.id}
                                    onProductSelect={() => handleProductSelect(producto.products.id)}
                                    showCheckbox={false}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-gray-300 mt-2"></div>

                <div className="h-44">
                    <div className="flex justify-between mt-4 px-6">
                        <div className="w-1/2">
                            <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
                                <div className="text-sm font-semibold text-gray-700 mb-2">Datos del Cliente</div>
                                <div className="space-y-2">
                                    {clienteSeleccionado ? (
                                        <>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div><strong>Cédula:</strong></div>
                                                <div>{clienteSeleccionado.id}</div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div><strong>Nombre:</strong></div>
                                                <div>{clienteSeleccionado.name}</div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div><strong>Correo:</strong></div>
                                                <div>{clienteSeleccionado.email}</div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div><strong>Teléfono:</strong></div>
                                                <div>{clienteSeleccionado.phone}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-2 animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col justify-between">
                            <div className="w-[220px] bg-[#D9D9D9] px-6 py-3 text-4xl text-right mt-2 ml-auto rounded-lg shadow-lg flex items-center justify-between mb-6">
                                <span className="text-2xl text-gray-700 font-semibold">$</span>
                                {precioTotal !== '' ? (
                                    <NumberFlow
                                        value={precioTotal}
                                        prefix=""
                                        locales="es-ES"
                                        duration={3}
                                        className="text-4xl text-gray-900 font-bold"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-8 h-8">
                                        <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    title="Cancelar"
                                    color="bg-[#818180]"
                                    onClick={cancelarDevolucion}
                                    className="px-6 py-2"
                                />
                                <Button
                                    title="Devolver"
                                    onClick={devolverCompra}
                                    color="bg-[#8B83BA]"
                                    className="px-6 py-2"
                                />

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {(status === "loading" || status === "success") && (
                <LoadingOverlay status={status} />
            )}
        </Layout>
    );
};


export default SalesReturn;
