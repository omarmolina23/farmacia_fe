import { useEffect, useState } from "react";
import { AppSidebarAdmin } from "../components/app-sidebar-admin";
import { SidebarProvider, SidebarInset } from "../../../components/ui/sidebar";
import { getStockSumary } from "../../../services/ProductService";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { GoAlertFill } from "react-icons/go";

const AdminLayout = ({ children, title }) => {
    const [lowStock, setLowStock] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        const checkLowStock = async () => {
            try {
                const stockData = await getStockSumary();
                const lowStockItems = stockData.filter(product => product.stock < 20);
                setLowStockProducts(lowStockItems);
                setLowStock(lowStockItems.length > 0);  

            } catch (error) {
                console.error("Error al obtener resumen de stock:", error.message);
            }
        };

        checkLowStock();
    }, []);

    const warningButton = (
        <Button
            size="sm"
            className="gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-md rounded-lg transition-all duration-200 hover:scale-105"
            onClick={() => setShowModal(true)}
        >
            <GoAlertFill size={20} />
            <span className="hidden sm:inline text-sm font-medium">Stock bajo</span>
        </Button>
    );



    const pageVariants = {
        initial: { opacity: 0, y: 5 },
        animate: { opacity: 2, y: 0 },
        exit: { opacity: 0, y: -16 },
    };

    const pageTransition = {
        duration: 0.3,
        ease: "easeInOut",
    };
    return (
        <SidebarProvider>
            <AppSidebarAdmin variant="inset" />
            <SidebarInset className="bg-white">
                <div className="flex flex-col w-full">
                    <PageHeader title={title} rightButton={lowStock ? warningButton : null} />
                    <motion.div
                        className="flex-1 overflow-auto"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        {children}
                    </motion.div>
                </div>
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 30, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="bg-white text-black w-full max-w-2xl rounded-2xl shadow-xl p-6"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center border-b pb-3 mb-4">
                                    <h2 className="text-xl font-bold">Stock mínimo</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-700 hover:text-black text-2xl font-bold transition-transform hover:scale-110"
                                        aria-label="Cerrar"
                                    >
                                        &times;
                                    </button>
                                </div>

                                {/* Tabla */}
                                <div className="overflow-hidden rounded-xl border border-gray-300 shadow-inner">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-200 text-black">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-semibold">Producto</th>
                                                <th className="px-4 py-2 text-center font-semibold">Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {lowStockProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-100 transition-colors">
                                                    <td className="px-4 py-2">{product.name}</td>
                                                    <td className="text-center px-4 py-2 font-bold text-red-600">{product.stock}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminLayout;