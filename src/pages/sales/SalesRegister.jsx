import { useAuth } from "../../context/authContext";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import NumberFlow from "@number-flow/react";
import LoadingOverlay from "../../components/LoadingOverlay";
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import EmployeesLayout from "../../modules/employees/layouts/EmployeeLayout";
import SalesProduct from "../../modules/admin/sales/components/SalesProduct";
import ModalRegisterClient from "../../modules/admin/sales/components/ModalRegisterClient";
import ProductDeleteModal from "../../modules/admin/sales/components/ModalDeleteProduct";
import ModalQR from "../../modules/admin/sales/components/ModalQR";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { getProductForSale } from "../../services/ProductService";
import { getClientAll } from "../../services/ClientService";
import { createSale } from "../../services/SalesService";
import { IoMdPersonAdd, IoIosAddCircleOutline } from "react-icons/io";
import { RiQrScan2Line } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

const SOCKET_SERVER_URL = import.meta.env.VITE_BARCODE_URL;

const SalesRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const Layout = user?.isAdmin ? AdminLayout : EmployeesLayout;
  const Modulo = user?.isAdmin ? "admin" : "employees";
  const [products, setProducts] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [precioTotal, setPrecioTotal] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [buscarCliente, setBuscarCliente] = useState("");
  const [sugerenciasClientes, setSugerenciasClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formDataCliente, setFormDataCliente] = useState({ name: "", id: "", email: "", phone: "", });
  const [showQRModal, setShowQRModal] = useState(false);
  const [status, setStatus] = useState("idle");
  const date = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));

  // Employee
  const employee = JSON.parse(localStorage.getItem("user"));

  // WS y sesión
  const sessionIdRef = localStorage.getItem("sessionId");

  const allProductsRef = useRef([]);

  // Mantener la ref de allProducts actualizada
  useEffect(() => {
    allProductsRef.current = allProducts;
  }, [allProducts]);

  // Obtener clientes
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

  // Sugerencias clientes
  useEffect(() => {
    const query = buscarCliente.toLowerCase().trim();

    const filtrados = query.length > 0
      ? clientes.filter((c) =>
        c.id.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query)
      )
      : [];

    setSugerenciasClientes(filtrados);
  }, [buscarCliente, clientes]);

  // Obtener productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductForSale();
        const productos = data.map((p) => ({
          ...p,
          price: p.price,
        }));
        setAllProducts(productos);
      } catch (err) {
        toast.error("Error cargando productos");
      }
    };
    fetchData();
  }, []);

  // Sugerencias productos
  useEffect(() => {
    const filtrados =
      buscar.trim().length > 0
        ? allProducts.filter((p) =>
          p.name.toLowerCase().includes(buscar.toLowerCase())
        )
        : [];
    setSugerencias(filtrados);
  }, [buscar, allProducts]);

  const calcularValorTotal = () => {
    const total = products.reduce((sum, p) => sum + p.totalPrice, 0);
    setPrecioTotal(total);
  };

  // Helper unificado para agregar/actualizar productos
  const addOrUpdateProduct = useCallback((producto, qty = 1) => {
    setProducts((prevProducts) => {
      const stock = producto.totalAmount || 0;
      const existe = prevProducts.find((p) => p.id === producto.id);

      if (existe) {
        const nuevaCantidad = existe.cantidad + qty;
        if (nuevaCantidad > stock) {
          toast.error("Cantidad excede el stock disponible");
          return prevProducts;
        }
        return prevProducts.map((p) =>
          p.id === producto.id
            ? {
              ...p,
              cantidad: nuevaCantidad,
              totalPrice: nuevaCantidad * p.price,
            }
            : p
        );
      } else {
        if (qty > stock) {
          toast.error("Cantidad excede el stock disponible");
          return prevProducts;
        }
        return [
          ...prevProducts,
          { ...producto, cantidad: qty, totalPrice: qty * producto.price },
        ];
      }
    });

    setBuscar("");
    setCantidad(1);
    setSugerencias([]);
  }, []);

  // Conexión WebSocket
  useEffect(() => {
    const sock = io(SOCKET_SERVER_URL);
    sock.on("connect", () => {
      sock.emit("join-room", sessionIdRef);
    });

    sock.on("scan", (productBarcode) => {
      const producto = allProductsRef.current.find(
        (p) => String(p.id).trim() === productBarcode
      );

      if (producto) {
        addOrUpdateProduct(producto, 1);
      } else {
        toast.error(`Producto con código ${productBarcode} no encontrado`);
      }
    });

    //return () => sock.disconnect();
  }, [addOrUpdateProduct]);

  const agregarProducto = () => {
    const nameKey = buscar.trim().toLowerCase();
    const producto = allProducts.find((p) => p.name.toLowerCase() === nameKey);
    if (!producto) {
      toast.error("Producto no encontrado");
      return;
    }
    addOrUpdateProduct(producto, cantidad);
  };

  useEffect(() => {
    calcularValorTotal();
  }, [products]);

  // Resto de handlers...
  const cancelarVenta = () => {
    setProducts([]);
    setClienteSeleccionado(null);
    setBuscarCliente("");
    navigate(`/${Modulo}/sales/list`);
  };
  const handleProductSelect = (id) =>
    setSelectedProductId((prev) => (prev === id ? null : id));
  const cancelarProducto = () => {
    const prod = products.find((p) => p.id === selectedProductId);
    prod
      ? setProductToDelete(prod)
      : toast.warn("Seleccione un producto primero");
  };
  const deleteProduct = (qty) => {
    const updated = products
      .map((p) =>
        p.id === selectedProductId
          ? p.cantidad > qty
            ? {
              ...p,
              cantidad: p.cantidad - qty,
              totalPrice: (p.cantidad - qty) * p.price,
            }
            : null
          : p
      )
      .filter(Boolean);
    setProducts(updated);
    setProductToDelete(null);
    setSelectedProductId(null);
  };
  const fetchClientes = async () => {
    try {
      const data = await getClientAll();
      setClientes(data);
    } catch (err) {
      toast.error("Error cargando clientes");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChangeCliente = e => setFormDataCliente(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const validarFormulario = () => products.length > 0 && clienteSeleccionado;
  const registrarCompra = async e => {
    e.preventDefault();
    if (!validarFormulario()) {
      toast.error(products.length === 0 ? 'Debe agregar al menos un producto' : 'Debe seleccionar un cliente');
      return;
    }
    try {
      setStatus("loading");
      const productsToSend = products.map(p => ({
        productId: p.id,
        amount: p.cantidad,
      }));
      const venta = {
        date: date.toISOString(),
        clientId: clienteSeleccionado.id,
        employeeName: employee.name,
        products: productsToSend,
      };
      await createSale(venta);
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        navigate(`/${Modulo}/sales/list`);
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Error al registrar la venta");
      setStatus("idle");
    }
  };

  return (
    <Layout title="Registrar Venta">
      <div className="flex flex-col h-screen">
        {/* Barra superior de búsqueda de productos */}
        <div className="flex items-center text-sm h-12 md:h-16 px-4 md:px-6">
          <div className="w-full bg-white px-2 py-3 md:px-4 md:py-3 flex flex-row justify-between items-center gap-3">
            {/* Bloque izquierdo: Search + Cantidad + Botones */}
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
                      {sug.name} - $
                      {new Intl.NumberFormat("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(sug.price)}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md bg-white w-24 md:w-auto">
                  <button
                    type="button"
                    className="px-2 py-1 text-lg text-gray-600 hover:bg-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#D0F25E]"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    tabIndex={-1}
                    aria-label="Disminuir cantidad"
                  >
                    –
                  </button>
                  <input
                    min="1"
                    value={cantidad}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCantidad(val >= 1 ? val : 1);
                    }}
                    className="w-12 h-8 text-center border-none focus:ring-0 focus:outline-none"
                    aria-label="Cantidad"
                  />
                  <button
                    type="button"
                    className="px-2 py-1 text-lg text-gray-600 hover:bg-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#D0F25E]"
                    onClick={() => setCantidad((c) => c + 1)}
                    tabIndex={-1}
                    aria-label="Incrementar cantidad"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={agregarProducto}
                  className="pl-2"
                  aria-label="Agregar producto"
                >
                  <IoIosAddCircleOutline size={30} className="text-[#8B83BA]" />
                </button>
              </div>

              <button onClick={cancelarProducto} className="ml-2">
                <MdOutlineDelete size={30} className="text-[#cd3535]" />
              </button>
            </div>

            {/* Bloque derecho: Icono QR alineado al extremo */}
            <div className="ml-auto px-4 py-3 md:px-6 md:py-4">
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
        <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[330px]">
          <table className="min-w-full text-sm table-fixed">
            <thead className="sticky top-0 bg-[#95A09D] z-9 text-left">
              <tr className="h-9">
                <th></th>
                <th className="text-center">N°</th>
                <th className="text-center">Nombre</th>
                <th className="text-center">Categoría</th>
                <th className="text-center">Proveedor</th>
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
                  showCheckbox={true}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-300 mt-2"></div>

        {/* Sección cliente y botones finales */}
        <div className="h-auto md:h-44">
          <div className="flex items-center text-sm h-12 md:h-16 px-4 md:px-6">
            <div className="flex w-full gap-2 relative items-center">
              <button
                onClick={() => setShowModal(true)}
                className="hover:opacity-80 transition"
              >
                <IoMdPersonAdd size={30} className="text-[#8B83BA]" />
              </button>
              <SearchBar
                value={buscarCliente}
                onChange={(e) => setBuscarCliente(e.target.value)}
                placeholder="Buscar cliente"
              />
              {sugerenciasClientes.length > 0 && (
                <div className="absolute top-full mt-1 left-0 w-full md:w-[400px] bg-white border shadow z-10 max-h-48 overflow-y-auto rounded">
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
          </div>

          <div className="flex flex-col md:flex-row justify-between mt-4 px-6">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              {clienteSeleccionado && (
                <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Datos del Cliente:
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <strong>Cédula:</strong>
                      </div>
                      <div>{clienteSeleccionado.id}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <strong>Nombre:</strong>
                      </div>
                      <div>{clienteSeleccionado.name}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <strong>Correo:</strong>
                      </div>
                      <div>{clienteSeleccionado.email}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <strong>Teléfono:</strong>
                      </div>
                      <div>{clienteSeleccionado.phone}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="w-full sm:w-[220px] bg-[#D9D9D9] px-4 sm:px-6 py-2 sm:py-3 text-4xl text-right mt-2 ml-auto rounded-lg shadow-lg flex items-center justify-between mb-6">
                <span className="text-2xl text-gray-700 font-semibold">$</span>
                <NumberFlow
                  value={precioTotal}
                  prefix=""
                  locales="es-ES"
                  duration={3}
                  className="text-4xl text-gray-900 font-bold"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <Button
                  title="Cancelar"
                  color="bg-[#818180]"
                  onClick={cancelarVenta}
                  className="px-6 py-2"
                />
                <Button
                  title="Aceptar"
                  color="bg-[#D0F25E]"
                  textColor="text-[#000000]"
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
        <ModalQR
          open={showQRModal}
          sessionIdRef={sessionIdRef}
          onClose={() => setShowQRModal(false)}
        />
        {(status === "loading" || status === "success") && (
          <LoadingOverlay status={status} />
        )}
        <ModalRegisterClient
          open={showModal}
          formData={formDataCliente}
          handleChange={handleChangeCliente}
          onClose={() => setShowModal(false)}
          refreshClients={fetchClientes}
        />
      </div>
    </Layout>

  );
};

export default SalesRegister;
