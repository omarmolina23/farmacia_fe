import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import ModalSendReset from "../../components/ModalSendReset";

const ModalResetPassword = ({ onClose }) => {
    const [email, setEmail] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Recuperar contraseña para:", email);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >

            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <AiOutlineQuestionCircle className="text-5xl mx-auto" />
                <h2 className="text-lg font-semibold mt-2">¿Olvidaste tu contraseña?</h2>
                <p className="text-gray-500 text-sm mb-4">
                    No te preocupes, es posible recuperarla.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5 flex flex-col items-start">
                        <label className="text-md md:text-md mt-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <TextField
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Correo electrónico"
                        />
                    </div>
                    <Button
                        type="submit"
                        title="Recuperar contraseña"
                        color="bg-[#8B83BB]"
                    />
                </form>
                <button
                    className="mt-4 text-gray-400 text-sm hover:underline"
                    onClick={onClose}
                >
                    Olvídalo, lo he recordado
                </button>
            </div>
        </div>
    );
};

export default ModalResetPassword;