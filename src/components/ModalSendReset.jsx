import React from "react";
import { BsFillSendFill } from "react-icons/bs";
import Button from "./Button";

const ModalSendReset = ({ onClose }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-medium mt-1">
        Se ha enviado un correo con las instrucciones para restablecer la
        contraseña.
      </h2>
      <BsFillSendFill className="text-4xl text-[#1E1E1E] mx-auto mt-6 mb-6" />
      <Button
        type="submit"
        title="¡Entendido!"
        onClick={onClose}
        color="bg-[#8B83BB]"
      />
    </div>
  );
};

export default ModalSendReset;
