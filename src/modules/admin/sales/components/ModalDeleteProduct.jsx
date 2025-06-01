import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../../components/Button";

const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 30, opacity: 0 },
};

const ProductDeleteModal = ({ productToDelete, deleteProduct, onClose }) => {
    const [quantityToDelete, setQuantityToDelete] = useState(1);

    if (!productToDelete) return null;

    const handleDelete = () => {
        deleteProduct(quantityToDelete);
        onClose();
    };

    return (
        <AnimatePresence>
            {productToDelete && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={onClose}
                    variants={backdropVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-white border p-6 rounded-2xl shadow-xl w-96"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <h2 className="text-lg font-semibold mb-4">Eliminar Producto</h2>
                        <p className="mb-4">
                            ¿Cuántas unidades de <strong>{productToDelete.name}</strong> deseas eliminar?
                        </p>
                        <div className="flex flex-col items-start mb-4">
                            <label htmlFor="quantityToDelete" className="text-md">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                max={productToDelete.cantidad}
                                value={quantityToDelete}
                                onChange={(e) => setQuantityToDelete(Number(e.target.value))}
                                id="quantityToDelete"
                                className="mt-1 border rounded px-2 py-1 w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                type="button"
                                title="Eliminar"
                                onClick={handleDelete}
                                color="bg-red-600 text-white"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductDeleteModal;
