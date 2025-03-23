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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(formData);
      toast.success("Proveedor registrado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({ name: "", phone: "", email: "", status: "ACTIVE" });
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
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
