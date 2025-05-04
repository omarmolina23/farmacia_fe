import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsappFloatButton = () => {
    const phoneNumber = "573115883433";
    const message =
        "¡Hola! Estoy interesado/a en obtener más información sobre sus productos.";

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
        >
            <div className="relative">
                <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 group-hover:animate-ping"></span>

                <div className="relative z-10 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out">
                    <FaWhatsapp size={28} />
                </div>
            </div>
        </a>
    );
};

export default WhatsappFloatButton;
