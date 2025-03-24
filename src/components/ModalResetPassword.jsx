import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import TextField from "./TextField";
import Button from "./Button";

const ModalResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recuperar contraseña para:", email);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
      <AiOutlineQuestionCircle className="text-4xl mx-auto text-gray-600" />
      <h2 className="text-lg font-semibold mt-2">¿Olvidaste tu contraseña?</h2>
      <p className="text-gray-500 text-sm mb-4">
        No te preocupes, es posible recuperarla.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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
          color="bg-purple-500 text-white"
        />
      </form>
      <button className="mt-4 text-gray-400 text-sm hover:underline">
        Olvídalo, lo he recordado
      </button>
    </div>
  );
};

export default ModalResetPassword;