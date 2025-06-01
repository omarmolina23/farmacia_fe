import React from "react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

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

const ModalQR = ({ sessionIdRef, onClose, open }) => {
    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
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
                        className="bg-white p-6 border-4 rounded-2xl shadow-xl w-96 text-center"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <QRCode
                            value={`${window.location.origin}/scan-page/${sessionIdRef}`}
                            size={160}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-lg font-semibold">Escanea este código QR</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Desde tu celular para leer códigos de barras.
                        </p>
                        <button
                            className="mt-4 text-gray-400 text-sm hover:underline"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalQR;
