import React from "react";
import QRCode from "react-qr-code";

const ModalQR = ({ sessionIdRef, onClose }) => {
    const handleOverlayClick = () => {
        onClose(); // Cierra el modal al hacer clic en el fondo
    };

    const handleModalClick = (e) => {
        e.stopPropagation(); // Evita que el clic dentro del modal cierre el fondo
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 border-4 rounded-lg shadow-lg w-96 text-center"
                onClick={handleModalClick}
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
            </div>
        </div>
    );
};

export default ModalQR;
