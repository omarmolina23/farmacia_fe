import React from "react";
import QRCode from "react-qr-code";

const ModalQR = ({ sessionIdRef, onClose }) => {
    return (
        <div
            className="bg-white p-6 border-4 rounded-lg shadow-lg w-96 text-center"
            onClick={(e) => e.stopPropagation()}
        >
            <QRCode
                value={`${window.location.origin}/scan-page/${sessionIdRef.current}`}
                size={160}
                className="mx-auto mb-4"
            />
            <h2 className="text-lg font-semibold">Escanea este código QR</h2>
            <p className="text-gray-500 text-sm mb-4">
                Desde tu celular para leer codigos de barras.
            </p>
            <button
                className="mt-4 text-gray-400 text-sm hover:underline"
                onClick={onClose}
            >
                Cerrar
            </button>
        </div>
    );
};

export default ModalQR;
