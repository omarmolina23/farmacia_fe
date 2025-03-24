import React from "react";
import { BsFillSendFill } from "react-icons/bs";

const ModalSendReset = ({ onClose }) => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-medium mt-1">
                    Se ha enviado un correo con las instrucciones para restablecer la contraseña.
                </h2>
                <BsFillSendFill className="text-4xl text-[#1E1E1E] mx-auto mt-6" />
            </div>
        </div>
    );
};

export default ModalSendReset;
    