import React from "react";
import TextField from "./TextField";
import Button from "./Button";

const ModalRegisterClient = ({
  formData,
  handleChange,
  handleSubmit,
  onClose,
}) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold mb-4">Datos del cliente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col items-start">
          <label htmlFor="name" className="text-md">Nombre</label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre completo"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="cedula" className="text-md">Cédula</label>
          <TextField
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="Número de cédula"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="text-md">Correo</label>
          <TextField
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="telefono" className="text-md">Telefono</label>
          <TextField
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Número de teléfono"
          />
        </div>

        <div className="flex justify-center mt-4 gap-3">
          <Button
            type="submit"
            title="Registrar"
            color="bg-[#8B83BB] text-white"
          />
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalRegisterClient;
