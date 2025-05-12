import React from "react";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";

const ModalRegisterClient = ({
  formData = { name: "", cedula: "", email: "", telefono: "" },
  handleChange,
  handleSubmit,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white border p-6 rounded-lg shadow-lg w-96"
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

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="submit"
              title="Registrar"
              color="bg-[#8B83BB] text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegisterClient;
