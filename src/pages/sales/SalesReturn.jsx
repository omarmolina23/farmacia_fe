import { useAuth } from "../../context/authContext";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import NumberFlow from '@number-flow/react';
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import EmployeesLayout from "../../modules/employees/layouts/EmployeeLayout"
import SalesProduct from "../../modules/admin/sales/components/SalesProduct";
import { getSalesId } from "../../services/SalesService";
import ProductDeleteModal from "../../modules/admin/sales/components/ModalDeleteProduct";
import ModalQR from "../../modules/admin/sales/components/ModalQR";
import { sendElectronicInvoice } from "../../modules/admin/sales/components/invoice/electronic_invoice/sendElectronicInvoice";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { getProductForSale } from "../../services/ProductService";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiQrScan2Line } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_SERVER_URL = import.meta.env.VITE_BARCODE_URL;

const SalesReturn = () => {
    const { sales_reference_id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const Layout = user?.isAdmin ? AdminLayout : EmployeesLayout;
    const Modulo = user?.isAdmin ? "admin" : "employees";
    const IVA = 0.19;

    const [products, setProducts] = useState([]);
    const [buscar, setBuscar] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [sugerencias, setSugerencias] = useState([]);
    const [cantidad, setCantidad] = useState(1);
    const [precioTotal, setPrecioTotal] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);


    // WS y sesión
    const sessionIdRef = localStorage.getItem("sessionId");

    const allProductsRef = useRef([]);

    // Mantener la ref de allProducts actualizada
    useEffect(() => {
        allProductsRef.current = allProducts;
    }, [allProducts]);

    // Obtener productos y calcular IVA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductForSale();
                console.log("Prorductos: ", data);
                const productosConIVA = data.map(p => ({
                    ...p,
                    price: p.price * (1 + IVA)
                }));
                setAllProducts(productosConIVA);
            } catch (err) {
                toast.error("Error loading products");
            }
        };
        fetchData();
    }, []);

    // Sugerencias productos
    useEffect(() => {
        const filtrados = buscar.trim().length > 0
            ? allProducts.filter(p => p.name.toLowerCase().includes(buscar.toLowerCase()))
            : [];
        setSugerencias(filtrados);
    }, [buscar, allProducts]);

    const calcularValorTotal = () => {
        const total = products.reduce((sum, p) => sum + p.totalPrice, 0);
        setPrecioTotal(total);
    };

    // Helper unificado para agregar/actualizar productos
    const addOrUpdateProduct = useCallback((producto, qty = 1) => {
        const stock = producto.totalAmount || 0;
        const existe = products.find(p => p.id === producto.id);

        if (existe) {
            const nuevaCantidad = existe.cantidad + qty;
            if (nuevaCantidad > stock) {
                toast.error('Cantidad excede el stock disponible');
                return;
            }
            setProducts(products.map(p =>
                p.id === producto.id
                    ? { ...p, cantidad: nuevaCantidad, totalPrice: nuevaCantidad * p.price }
                    : p
            ));
        } else {
            if (qty > stock) {
                toast.error('Cantidad excede el stock disponible');
                return;
            }
            setProducts([...products, { ...producto, cantidad: qty, totalPrice: qty * producto.price }]);
        }

        setBuscar('');
        setCantidad(1);
        setSugerencias([]);
    }, [products]);

    // Conexión WebSocket
    useEffect(() => {
        const sock = io(SOCKET_SERVER_URL);
        sock.on("connect", () => {
            sock.emit("join-room", sessionIdRef.current);
        });

        sock.on("scan", rawBarcode => {
            const cleanedId = String(rawBarcode).trim();
            const producto = allProductsRef.current.find(p => String(p.id).trim() === cleanedId);
            if (!producto) {
                toast.error("Producto escaneado no encontrado");
                return;
            }
            addOrUpdateProduct(producto, 1);
        });

        return () => sock.disconnect();
    }, [addOrUpdateProduct]);

    useEffect(() => {
        const saleBack = async () => {
            try {
                const sale = await getSalesId(sales_reference_id);
                console.log("venta es:", sale)

                
                if (sale?.client) {
                    console.log("cliente es:", sale.client)
                    setClienteSeleccionado(sale.client);
                }

                if (sale?.products) {
                    const productosConvertidos = sale.products.map(p => {
                        const precioConIVA = p.products.price * (1 + IVA);
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
                console.error(error);
            }
        };
        saleBack();
    }, [sales_reference_id]);


    const agregarProducto = () => {
        const nameKey = buscar.trim().toLowerCase();
        const producto = allProducts.find(p => p.name.toLowerCase() === nameKey);
        if (!producto) {
            toast.error("Producto no encontrado");
            return;
        }
        addOrUpdateProduct(producto, cantidad);
    };

    useEffect(() => {
        calcularValorTotal();
    }, [products]);

    const cancelarVenta = () => {
        setProducts([]);
        setClienteSeleccionado(null);
        setBuscarCliente('');
        navigate(`/${Modulo}/sales/list`);
    };
    const handleProductSelect = id => setSelectedProductId(prev => prev === id ? null : id);
    const cancelarProducto = () => {
        const prod = products.find(p => p.id === selectedProductId);
        prod ? setProductToDelete(prod) : toast.warn("Seleccione un producto primero");
    };
    const deleteProduct = qty => {
        const updated = products.map(p =>
            p.id === selectedProductId
                ? (p.cantidad > qty ? { ...p, cantidad: p.cantidad - qty, totalPrice: (p.cantidad - qty) * p.price } : null)
                : p
        ).filter(Boolean);
        setProducts(updated);
        setProductToDelete(null);
        setSelectedProductId(null);
    };
    const validarFormulario = () => products.length > 0 && clienteSeleccionado;
    const registrarCompra = async e => {
        e.preventDefault();
        if (!validarFormulario()) {
            toast.error(products.length === 0 ? 'Debe agregar al menos un producto' : 'Debe seleccionar un cliente');
            return;
        }
        try {

            //console.log("products", products);
            const productsToSend = products.map(p => ({
                productId: p.id,
                amount: p.cantidad,
            }));

            const responseEInvoice = await sendElectronicInvoice({ cliente: clienteSeleccionado, productos: products });

            await createSale({
                clientId: clienteSeleccionado.id,
                employeeName: employee.name,
                products: productsToSend,
                bill_id: responseEInvoice.data.bill.id,
                number_e_invoice: responseEInvoice.data.bill.reference_code,
                cufe: responseEInvoice.data.bill.cufe,
                qr_image: responseEInvoice.data.bill.qr_image,
            });

            toast.success("Factura electrónica generada exitosamente");
            navigate(`/${Modulo}/sales/list`);
        } catch (error) {
            toast.error("Error al generar la factura electrónica");
        }
    };

    return (
        <Layout title="Registrar Venta">
            <div className="flex flex-col h-screen">
                {/* Barra superior de búsqueda de productos */}
                <div className="flex items-center text-sm h-16 px-6">
                    <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
                        <div className="flex w-full md:w-auto gap-3 relative">
                            <SearchBar
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                placeholder="Buscar producto"
                            />
                            {sugerencias.length > 0 && (
                                <div className="absolute top-full mt-1 left-0 w-full bg-white border shadow z-10 max-h-48 overflow-y-auto rounded">
                                    {sugerencias.map((sug, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setBuscar(sug.name);
                                                setSugerencias([]);
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sug.name} - ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(sug.price)}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center">
                                <label htmlFor="name" className="text-md font-medium">Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(Number(e.target.value))}
                                    className="ml-2 w-16 h-8 border rounded-md text-center"
                                />
                                <button onClick={agregarProducto} className="pl-2">
                                    <IoIosAddCircleOutline size={30} className="text-[#8B83BA]" />
                                </button>
                            </div>
                            <button onClick={cancelarProducto}
                            >

                                <MdOutlineDelete size={30} className="text-[#cd3535]" />

                            </button>
                        </div>
                        <div className="px-6 py-4">
                            <button
                                onClick={() => setShowQRModal(true)}
                                className="text-2xl text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <RiQrScan2Line />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla de productos agregados */}
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
                                    numeroProducto={index + 1}
                                    key={producto.products.id}
                                    name={producto.products.name}
                                    category={producto.products.categoryId}
                                    supplier={producto.products.supplierId}
                                    cantidad={producto.amount}
                                    price={producto.products.price}
                                    precioTotal={producto.totalPrice}
                                    isSelected={selectedProductId === producto.products.id}
                                    onProductSelect={() => handleProductSelect(producto.products.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-gray-300 mt-2"></div>

                <div className="h-44">
                    <div className="flex justify-between mt-4 px-6">
                        {clienteSeleccionado && (

                            <div className="w-1/2">
                                <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
                                    <div className="text-sm font-semibold text-gray-700 mb-2">Datos del Cliente</div>
                                    <div className="space-y-2">
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
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="w-1/2 flex flex-col justify-between">
                            <div className="w-[220px] bg-[#D9D9D9] px-6 py-3 text-4xl text-right mt-2 ml-auto rounded-lg shadow-lg flex items-center justify-between mb-6"> {/* Añadido mb-6 para separar los botones */}
                                <span className="text-2xl text-gray-700 font-semibold">$</span>
                                <NumberFlow
                                    value={precioTotal}
                                    prefix=""
                                    locales="es-ES"
                                    duration={3}
                                    className="text-4xl text-gray-900 font-bold"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    title="Cancelar"
                                    color="bg-[#818180]"
                                    onClick={cancelarVenta}
                                    className="px-6 py-2"
                                />
                                <Button
                                    title="Aceptar"
                                    color="bg-[#8B83BA]"
                                    onClick={registrarCompra}
                                    className="px-6 py-2"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {productToDelete && (
                    <ProductDeleteModal
                        productToDelete={productToDelete}
                        deleteProduct={deleteProduct}
                        onClose={() => setProductToDelete(null)}
                    />
                )}
                {showQRModal && (
                    <ModalQR
                        open={showQRModal}
                        sessionIdRef={sessionIdRef}
                        onClose={() => setShowQRModal(false)}
                    />
                )}
            </div>
        </Layout>
    );
};


export default SalesReturn;
