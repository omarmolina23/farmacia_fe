import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout";
import SupplierForm from "../../modules/admin/supplier/components/SupplierForm";
import { createSupplier } from "../../services/SupplierService";
import "react-toastify/dist/ReactToastify.css";

export default function SupplierRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      let cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.startsWith("57")) {
        cleanedValue = cleanedValue.slice(2);
      }
      const phoneNumber = cleanedValue.slice(0, 10);
      setFormData({ ...formData, [name]: `+57${phoneNumber}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("El nombre del proveedor es obligatorio.");
    }

    if (!formData.phone || formData.phone.length !== 13) {
      errors.push("El teléfono debe contener exactamente 10 dígitos después de +57.");
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
      navigate("/admin/supplier/list");
      setFormData({ name: "", phone: "", email: "", status: "ACTIVE" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", phone: "", email: "", status: "ACTIVE" });
    navigate("/admin/supplier/list");
  };

  return (
    <SupplierLayout title="Registrar proveedor">
      <SupplierForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </SupplierLayout>
  );
}