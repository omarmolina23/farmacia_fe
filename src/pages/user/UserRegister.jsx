import React, { useState } from "react";
import { toast } from "react-toastify";
import UserLayout from "../../modules/admin/user/layout/UserLayout";
import UserForm from "../../modules/admin/user/components/UserForm";
import "react-toastify/dist/ReactToastify.css";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    phone: "",
    email: "",
    confirmEmail: "",
    age: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.role) {
      errors.push("El rol es obligatorio.");
    }

    if (!formData.fullName.trim()) {
      errors.push("El nombre completo es obligatorio.");
    }

    if (!formData.phone || formData.phone.length !== 13) {
      errors.push(
        "El teléfono debe contener exactamente 10 dígitos después de +57."
      );
    }

    if (!formData.email.trim()) {
      errors.push("El correo electrónico es obligatorio.");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("El correo electrónico no es válido.");
    }

    if (formData.email !== formData.confirmEmail) {
      errors.push("Los correos electrónicos no coinciden.");
    }

    if (!formData.age.trim() || isNaN(formData.age) || formData.age < 18) {
      errors.push("La edad es obligatoria y debe ser mayor o igual a 18 años.");
    }

    if (errors.length > 0) {
      errors.forEach((err) =>
        toast.error(err, { position: "top-right", autoClose: 3000 })
      );
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
      toast.success("Usuario registrado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        role: "",
        fullName: "",
        phone: "",
        email: "",
        confirmEmail: "",
        age: "",
        status: "ACTIVE",
      });
    } catch (error) {
      toast.error("Ocurrió un error al registrar el usuario.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      role: "",
      fullName: "",
      phone: "",
      email: "",
      confirmEmail: "",
      age: "",
      status: "ACTIVE",
    });
  };

  return (
    <UserLayout title="Registrar usuario">
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </UserLayout>
  );
}
