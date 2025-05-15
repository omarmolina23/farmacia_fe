import React, { useState } from "react";
import Button from "../../../../components/Button";

const ProductDeleteModal = ({ productToDelete, deleteProduct, onClose }) => {
    const [quantityToDelete, setQuantityToDelete] = useState(1);

    if (!productToDelete) return null;

    const handleDelete = () => {
        deleteProduct(quantityToDelete);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white border p-6 rounded-lg shadow-lg w-96"
                onClick={(e) => e.stopPropagation()}
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
            </div>
        </div>
    );
};

export default ProductDeleteModal;
