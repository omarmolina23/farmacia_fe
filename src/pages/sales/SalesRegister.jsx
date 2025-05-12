import { useEffect, useState } from "react";
import SalesLayout from "../../modules/admin/sales/layout/SalesLayout";
import SalesProduct from "../../modules/admin/sales/components/SalesProduct";
import ModalRegiterClient from "../../modules/admin/sales/components/ModalRegiterClient";
import ProductDeleteModal from "../../modules/admin/sales/components/ModalDeleteProduct";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { getProductAll } from "../../services/SalesService";
import { getClientAll } from "../../services/ClientService";
import { IoMdPersonAdd, IoIosAddCircleOutline } from "react-icons/io";
import 'react-toastify/dist/ReactToastify.css';

const SalesRegister = () => {
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
    const [showModal, setShowModal] = useState(false);

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
            ? clientes.filter(c => c.cedula.toLowerCase().includes(buscarCliente.toLowerCase()))
            : [];
        setSugerenciasClientes(filtrados);
    }, [buscarCliente, clientes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductAll();
                setAllProducts(data);
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

        const stock = productoSeleccionado.batches?.[0]?.quantity || 0;

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
        if (!nombreCliente) {
            toast.error('Debe escribir el nombre del cliente');
            return false;
        }
        return true;
    };

    const registrarCompra = (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            toast.success('Venta registrada (simulado)');
            cancelarVenta();
        }
    };

    return (
        <SalesLayout title="Registrar Venta">
            <div className="flex flex-col h-screen">
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
                                            {sug.name}
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
                        </div>
                        <Button
                            title="Cancelar Producto"
                            color="bg-[#818180]"
                            onClick={cancelarProducto}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto max-h-[330px]">
                    <table className="min-w-full text-sm table-fixed">
                        <thead className="sticky top-0 bg-[#95A09D] z-9 text-left">
                            <tr className="h-9">
                                <th ></th>
                                <th>N°</th>
                                <th className="text-left">Nombre</th>
                                <th className="text-left">Categoria</th>
                                <th className="text-left">Proveedor</th>
                                <th className="text-center">Lote</th>
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
                                    batch={producto.batches?.[0]?.batch_number}
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

                <div className="h-44">
                    <div className="flex items-center text-sm h-16 px-6">
                        <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
                            <div className="flex w-full md:w-auto gap-2 relative items-center">
                                <button onClick={() => setShowModal(true)} className="hover:opacity-80 transition">
                                    <IoMdPersonAdd size={30} className="text-[#8B83BA]" />
                                </button>
                                <SearchBar
                                    value={buscarCliente}
                                    onChange={(e) => setBuscarCliente(e.target.value)}
                                    placeholder="Buscar cliente"
                                />
                                {sugerenciasClientes.length > 0 && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white border shadow z-10 max-h-48 overflow-y-auto rounded">
                                        {sugerenciasClientes.map((sug, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    setBuscarCliente(sug.cedula);
                                                    setNombreCliente(sug.cedula);
                                                    setSugerenciasClientes([]);
                                                }}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {sug.cedula}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {showModal && (
                                <ModalRegiterClient onClose={() => setShowModal(false)} />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-4 mt-4 px-6">
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
                        <div className="w-64 bg-[#D9D9D9] p-4 text-3xl">${precioTotal}</div>
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
        </SalesLayout>
    );
};

export default SalesRegister;
