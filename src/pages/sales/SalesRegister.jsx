import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import NumberFlow from '@number-flow/react';
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import EmployeesLayout from "../../modules/employees/layouts/EmployeeLayout"
import SalesProduct from "../../modules/admin/sales/components/SalesProduct";
import ModalRegisterClient from "../../modules/admin/sales/components/ModalRegisterClient";
import ProductDeleteModal from "../../modules/admin/sales/components/ModalDeleteProduct";
import ModalQR from "../../modules/admin/sales/components/ModalQR";
import { sendElectronicInvoice } from "../../modules/admin/sales/components/invoice/sendElectronicInvoice";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { getProductAll } from "../../services/SalesService";
import { getClientAll } from "../../services/ClientService";
import { IoMdPersonAdd, IoIosAddCircleOutline } from "react-icons/io";
import { RiQrScan2Line } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_SERVER_URL = import.meta.env.VITE_BARCODE_URL;

const SalesRegister = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [buscar, setBuscar] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [sugerencias, setSugerencias] = useState([]);
    const [cantidad, setCantidad] = useState(1);
    const [precioTotal, setPrecioTotal] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [nombreCliente, setNombreCliente] = useState('');
    const [clientes, setClientes] = useState([]);
    const [buscarCliente, setBuscarCliente] = useState('');
    const [sugerenciasClientes, setSugerenciasClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formDataCliente, setFormDataCliente] = useState({ name: "", id: "", email: "", phone: "" });
    const { user } = useAuth();
    const Layout = user?.isAdmin ? AdminLayout : EmployeesLayout;
    const Modulo = user?.isAdmin ? "admin" : "employees";
    const IVA = 0.19;

    // WS y sesión
    const sessionId = useState(crypto.randomUUID());
    const [showQRModal, setShowQRModal] = useState(false);

    /**
     * socket.on("connect", () => {
    

  // Unirse a la misma sala
  socket.emit("join-room", "test-session");

  console.log("🖥️ Unida a la sala 'test-session'");
});
     */
    // Conectar WebSocket y unirse a sala
    useEffect(() => {
        const sock = io(SOCKET_SERVER_URL);

        sock.on("connect", () => {
            console.log("🖥️ PC conectada con ID:", sock.id);
            sock.emit("join-room", sessionId);
            console.log(`🖥️ Unida a la sala '${sessionId}'`);
        });
        sock.on("scan", (productBarcode) => {
            console.log("🖥️ Producto escaneado recibido:", productBarcode);
            handleScanResult(productBarcode);
        });
        /*
        return () => {
            sock.off('scanned');
            sock.disconnect();
        };

        */
    }, [sessionId, allProducts, products]);

    // Función para procesar producto escaneado
    const handleScanResult = (productId) => {
        const producto = allProducts.find(p => p.id === productId);

        if (!producto) {
            toast.error("Producto no encontrado");
            return;
        }

        const stock = producto.amount || 0;
        const existe = products.find(p => p.id === producto.id);

        if (existe) {
            const nuevaCantidad = Number(existe.cantidad) + 1;

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
            if (1 > stock) {
                toast.error("Cantidad excede el stock disponible");
                return;
            }

            setProducts([...products, { ...producto, cantidad: 1, totalPrice: producto.price }]);
        }

        setBuscar('');
        setCantidad(1);
        setSugerencias([]);
    };


    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await getClientAll();
                setClientes(data);
            } catch (err) {
                toast.error("Error cargando clientes");
            }
        };
        fetchClientes();
    }, []);

    useEffect(() => {
        const filtrados = buscarCliente.trim().length > 0
            ? clientes.filter(c => c.id.toLowerCase().includes(buscarCliente.toLowerCase()))
            : [];
        setSugerenciasClientes(filtrados);
    }, [buscarCliente, clientes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductAll();
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

    useEffect(() => {
        const filtrados = buscar.trim().length > 0
            ? allProducts.filter(p => p.name.toLowerCase().includes(buscar.toLowerCase()))
            : [];
        setSugerencias(filtrados);
    }, [buscar, allProducts]);

    useEffect(() => {
        calcularValorTotal();
    }, [products]);

    const agregarProducto = () => {
        const productoSeleccionado = allProducts.find(p => p.name.toLowerCase() === buscar.toLowerCase());

        if (!productoSeleccionado) {
            toast.error("Producto no encontrado");
            return;
        }

        const stock = productoSeleccionado.amount || 0;
        const existe = products.find(p => p.id === productoSeleccionado.id);

        if (existe) {
            const nuevaCantidad = Number(existe.cantidad) + Number(cantidad);
            if (nuevaCantidad > stock) {
                toast.error("Cantidad excede el stock disponible");
                return;
            }
            const actualizados = products.map(p => {
                if (p.id === productoSeleccionado.id) {
                    return {
                        ...p,
                        cantidad: nuevaCantidad,
                        totalPrice: nuevaCantidad * p.price
                    };
                }
                return p;
            });
            setProducts(actualizados);
        } else {
            if (cantidad > stock) {
                toast.error("Cantidad excede el stock disponible");
                return;
            }
            const nuevo = {
                ...productoSeleccionado,
                cantidad,
                totalPrice: cantidad * productoSeleccionado.price
            };
            setProducts([...products, nuevo]);
        }

        setBuscar('');
        setCantidad(1);
        setSugerencias([]);
    };

    const handleProductSelect = (productId) => {
        setSelectedProductId(prev => prev === productId ? null : productId);
    };

    const calcularValorTotal = () => {
        const total = products.reduce((sum, p) => sum + p.totalPrice, 0);
        setPrecioTotal(total);
    };

    const cancelarVenta = () => {
        setProducts([]);
        setNombreCliente('');
        setClienteSeleccionado(null);
        setBuscarCliente('');
        navigate(`/${Modulo}/sales/list`);
    };

    const handleChangeCliente = (e) => {
        const { name, value } = e.target;
        setFormDataCliente(prev => ({ ...prev, [name]: value }));
    };

    const cancelarProducto = () => {
        const producto = products.find(p => p.id === selectedProductId);
        if (producto) {
            setProductToDelete(producto);
        } else {
            toast.warn("Seleccione un producto primero");
        }
    };

    const deleteProduct = (quantityToDelete) => {
        const updatedProducts = products.map((producto) => {
            if (producto.id === selectedProductId) {
                if (producto.cantidad > quantityToDelete) {
                    return {
                        ...producto,
                        cantidad: producto.cantidad - quantityToDelete,
                        totalPrice: (producto.cantidad - quantityToDelete) * producto.price,
                    };
                }
                return null;
            }
            return producto;
        }).filter(Boolean);

        setProducts(updatedProducts);
        setProductToDelete(null);
        setSelectedProductId(null);
        calcularValorTotal();
    };

    const validarFormulario = () => {
        if (products.length === 0) {
            toast.error('Debe agregar al menos un producto');
            return false;
        }
        if (!clienteSeleccionado) {
            toast.error('Debe seleccionar un cliente');
            return false;
        }
        return true;
    };

    const registrarCompra = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        try {
            await sendElectronicInvoice({
                cliente: clienteSeleccionado,
                productos: products
            });
            toast.success("Factura electrónica generada exitosamente");
            cancelarVenta();
        } catch (error) {
            console.error(error);
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
                                            {sug.name} - ${sug.price}
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
                        {showQRModal && (
                            <div className="fixed inset-0 flex items-center justify-center">
                                <ModalQR
                                    open={showQRModal}
                                    sessionId={sessionId}
                                    onClose={() => setShowQRModal(false)}
                                />
                            </div>
                        )}
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
                                    key={producto.id}
                                    name={producto.name}
                                    category={producto.category}
                                    supplier={producto.supplier}
                                    cantidad={producto.cantidad}
                                    price={producto.price}
                                    precioTotal={producto.totalPrice}
                                    isSelected={selectedProductId === producto.id}
                                    onProductSelect={() => handleProductSelect(producto.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-gray-300 mt-2"></div>

                {/* Sección cliente y botones finales */}
                <div className="h-44">
                    <div className="flex items-center text-sm h-16 px-6">
                        <div className="flex w-full gap-2 relative items-center">
                            <button onClick={() => setShowModal(true)} className="hover:opacity-80 transition">
                                <IoMdPersonAdd size={30} className="text-[#8B83BA]" />
                            </button>
                            <SearchBar
                                value={buscarCliente}
                                onChange={(e) => setBuscarCliente(e.target.value)}
                                placeholder="Buscar cliente"
                            />
                            {sugerenciasClientes.length > 0 && (
                                <div className="absolute top-full mt-1 left-0 w-[400px] bg-white border shadow z-10 max-h-48 overflow-y-auto rounded">
                                    {sugerenciasClientes.map((sug, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setBuscarCliente(sug.id);
                                                setNombreCliente(sug.id);
                                                setClienteSeleccionado(sug);
                                                setSugerenciasClientes([]);
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {sug.id} - {sug.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {showModal && (
                            <ModalRegisterClient
                                formData={formDataCliente}
                                handleChange={handleChangeCliente}
                                onClose={() => setShowModal(false)}
                            />
                        )}
                    </div>

                    <div className="flex justify-between mt-4 px-6">
                        <div className="w-1/2">
                            {clienteSeleccionado && (
                                <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
                                    <div className="text-sm font-semibold text-gray-700 mb-2">Datos del Cliente:</div>
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
                            )}
                        </div>

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
            </div>
        </Layout>
    );
};


export default SalesRegister;
