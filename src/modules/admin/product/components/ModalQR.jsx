import React from "react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    initial: { scale: 0.95, opacity: 0, y: 30 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: 30 },
};

const ModalQR = ({ sessionIdRef, onClose, open }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                    variants={backdropVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-white p-6 border-4 rounded-lg shadow-lg w-96 text-center"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <QRCode
                            value={`${window.location.origin}/register-barcode/${sessionIdRef}`}
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
    