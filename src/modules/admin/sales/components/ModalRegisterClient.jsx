import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { createClient } from "../../../../services/ClientService"; 
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 30, opacity: 0 },
};

const ModalRegisterClient = ({
  formData = { name: "", id: "", email: "", phone: "" },
  handleChange,
  onClose,
  refreshClients,
  open,
}) => {
  if (!open) return null;

  const handleSubmit = async () => {
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

      if (refreshClients) {
        await refreshClients();
      }

      onClose();
    } catch (error) {
      toast.error(error?.message || "Error al registrar cliente");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative bg-white border p-6 rounded-2xl shadow-xl w-96"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Cerrar modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">Registrar Cliente</h2>

            <div className="flex flex-col gap-3">
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
                  title="Registrar"
                  color="bg-[#8B83BB] text-white"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalRegisterClient;
