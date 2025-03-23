import React, { useState } from "react";
import { toast } from "react-toastify";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout";
import SupplierForm from "../../modules/admin/supplier/components/SupplierForm";
import { createSupplier } from "../../services/SupplierService";
import "react-toastify/dist/ReactToastify.css";

export default function SupplierRegister() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
  const errors = [];

  if (!formData.name.trim()) {
    errors.push("El nombre del proveedor es obligatorio.");
  }

  if (!formData.phone.trim()) {
    errors.push("El teléfono del proveedor es obligatorio.");
  } else if (!/^\+57\s?\d{10}$/.test(formData.phone)) {
    errors.push("El teléfono debe estar en formato +573XXXXXXXXX");
  }

  if (!formData.email.trim()) {
    errors.push("El correo electrónico es obligatorio.");
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.push("El correo electrónico no es válido.");
  }

  if (errors.length > 0) {
    errors.forEach((err) => toast.error(err, { position: "top-right", autoClose: 3000 }));
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createSupplier(formData);
      toast.success("Proveedor registrado exitosamente", { position: "top-right", autoClose: 3000 });

      setFormData({ name: "", phone: "", email: "", status: "ACTIVE" });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            if (data.errors) {
              data.errors.forEach((err) => {
                toast.error(err.message, { position: "top-right", autoClose: 3000 });
              });
            } else {
              toast.error(`Error: ${data.message || "Datos inválidos."}`, { position: "top-right", autoClose: 3000 });
            }
            break;
          case 409:
            toast.error("Ya existe un proveedor con este correo o teléfono.", { position: "top-right", autoClose: 3000 });
            break;
          case 500:
            toast.error("Error en el servidor, inténtelo más tarde.", { position: "top-right", autoClose: 3000 });
            break;
          default:
            toast.error("Ocurrió un error inesperado.", { position: "top-right", autoClose: 3000 });
        }
      } else {
        toast.error("No se pudo conectar con el servidor.", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", phone: "", email: "", status: "ACTIVE" });
  };


  return (
    <SupplierLayout title="Proveedores">
      <SupplierForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </SupplierLayout>
  );
}
