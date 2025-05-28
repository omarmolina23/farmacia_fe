import React, { useState } from "react";
import Button from "../../../../components/Button";
import { toast } from "sonner";

const FilterModal = ({ onClose, onApply }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = () => {
        if (!startDate && !endDate) {
            onApply(null);
            onClose();
            return;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            toast.error("La primera fecha no puede ser mayor a la segunda.");
            return;
        }

        const finalStart = startDate || endDate;
        const finalEnd = endDate || startDate;

        onApply({ startDate: finalStart, endDate: finalEnd });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white border p-6 rounded-lg shadow-lg w-80"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-light mb-4">Filtrar por fecha</h2>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Primera fecha
                    </label>
                    <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Segunda fecha
                    </label>
                    <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button title="Aceptar" onClick={handleSubmit} color="bg-[#D0F25E]"
                        textColor="text-[#000000]" />
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
