import React, { useState } from "react";
import { forgotPassword as forgotPasswordService } from "../../services/UserService";
import { toast } from "react-toastify";
import ModalSendReset from "../../components/ModalSendReset";
import ModalResetPasswordField from "../../components/ModalResetPasswordField";

const ModalResetPassword = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email) {
            toast.error("Por favor, ingresa un correo electrónico.", { position: "top-center"});
            return;
        }

        try {
            const response = await forgotPasswordService(email);
            console.log("response", response);

            setIsSuccess(true);
            toast.success("Correo enviado exitosamente", { position: "top-center"});
        } catch (error) {
            toast.error(error.message, { position: "top-center"});
        }

        console.log("Recuperar contraseña para:", email);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >

           {isSuccess ? (
                <ModalSendReset onClose={onClose} />
            ) : (
                <ModalResetPasswordField
                    email={email}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                />
            )}
        </div>
    );
};

export default ModalResetPassword;