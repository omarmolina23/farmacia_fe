import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../../../components/Button";
import { toast } from "sonner";

const modalBackgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalContentVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 30, opacity: 0 },
};

const FilterModal = ({ show, onClose, onApply }) => {
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
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm"
                    variants={modalBackgroundVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        className="bg-white border p-6 rounded-2xl shadow-xl w-80"
                        variants={modalContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.25, ease: "easeOut" }}
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
                            <Button
                                title="Aceptar"
                                onClick={handleSubmit}
                                color="bg-[#D0F25E]"
                                textColor="text-[#000000]"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FilterModal;
