import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signUp } from "../../services/UserService";
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import UserForm from "../../modules/admin/user/components/UserForm";
import "react-toastify/dist/ReactToastify.css";

export default function UserRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    confirmEmail: "",
    birthdate: "",
    status: "ACTIVE",
    role: "",
    documentType: "",
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

    if (!formData.role.trim()) {
      errors.push("El rol es obligatorio.");
    }

    if (!formData.documentType.trim()) {
      errors.push("El tipo de documento es obligatorio.");
    }

    if (!formData.name.trim()) {
      errors.push("El nombre completo es obligatorio.");
    }

    if (!formData.phone || !/^\+57\d{10}$/.test(formData.phone)) {
      errors.push(
        "El teléfono debe tener el formato +57 seguido de 10 dígitos."
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

    if (!formData.birthdate.trim()) {
      errors.push("La fecha de nacimiento es obligatoria.");
    } else {
      const birthYear = new Date(formData.birthdate).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      if (isNaN(age) || age < 18) {
        errors.push("Debe ser mayor o igual a 18 años.");
      }
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

    const userData = {
      id: formData.id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      birthdate: formData.birthdate,
      status: formData.status,
      documentType: formData.documentType,
      isAdmin: formData.role === "Administrador",
      isEmployee: formData.role === "Vendedor",
    };

    try {
      await signUp(userData);
      toast.success("Usuario registrado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        id: "",
        name: "",
        phone: "",
        email: "",
        confirmEmail: "",
        birthdate: "",
        status: "ACTIVE",
        documentType: "",
        role: "",
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            if (data.errors) {
              data.errors.forEach((err) => {
                toast.error(err.message, {
                  position: "top-right",
                  autoClose: 3000,
                });
              });
            } else {
              toast.error(`Error: ${data.message || "Datos inválidos."}`, {
                position: "top-right",
                autoClose: 3000,
              });
            }
            break;
          case 409:
            toast.error("Ya existe un usuario con este correo o teléfono.", {
              position: "top-right",
              autoClose: 3000,
            });
            break;
          case 500:
            toast.error("Error en el servidor, inténtelo más tarde.", {
              position: "top-right",
              autoClose: 3000,
            });
            break;
          default:
            toast.error("Ocurrió un error inesperado.", {
              position: "top-right",
              autoClose: 3000,
            });
        }
      } else {
        toast.error("No se pudo conectar con el servidor.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      id: "",
      name: "",
      phone: "",
      email: "",
      confirmEmail: "",
      birthdate: "",
      documentType: "",
      status: "ACTIVE",
      role: "",
    });
    navigate("/admin/user/list");
  };

  return (
    <AdminLayout title="Registrar usuario">
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        isEditMode={false}
      />
    </AdminLayout>
  );
}
