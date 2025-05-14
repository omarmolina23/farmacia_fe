import React from "react";
import { createClient } from "../../../../services/ClientService";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import { toast } from "react-hot-toast";

const ModalRegisterClient = ({
  formData = { name: "", id: "", email: "", phone: "" },
  handleChange,
  onClose,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name || !formData.id || !formData.email || !formData.phone) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (formData.id.length < 8 || formData.id.length > 12) {
      toast.error("La cédula debe tener entre 8 y 12 caracteres.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Correo electrónico inválido.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formData.phone)) {
      toast.error("El teléfono debe tener 10 dígitos.");
      return;
    }
    const clientData = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      await createClient(clientData);
      toast.success("Cliente registrado correctamente");
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al registrar cliente");
    }
  };

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
            <label htmlFor="id" className="text-md">Cédula</label>
            <TextField
              type="text"
              id="id"
              name="id"
              value={formData.id}
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
            <label htmlFor="phone" className="text-md">Teléfono</label>
            <TextField
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
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
