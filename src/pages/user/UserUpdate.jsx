import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import UserForm from "../../modules/admin/user/components/UserForm";
import Loading from "../../components/Loading";
import "react-toastify/dist/ReactToastify.css";
import { updateUser, searchUser } from "../../services/UserService";

export default function UserUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const results = await searchUser(id);

      if (results.length > 0) {
        const user = results[0];

        const formattedBirthdate = user.birthdate
          ? user.birthdate.split("T")[0]
          : "";

        let role = "";
        if (user.isAdmin) {
          role = "Administrador";
        } else if (user.isEmployee) {
          role = "Vendedor";
        }

        setFormData({
          id: user.name ?? "",
          name: user.name ?? "",
          phone: user.phone ?? "",
          email: user.email ?? "",
          confirmEmail: user.email ?? "",
          documentType: user.documentType ?? "",
          birthdate: formattedBirthdate,
          role: role ?? "",
        });
      } else {
        toast.error("Usuario no encontrado");
        navigate("/admin/user/list");
      }
    } catch (error) {
      toast.error("Error en la búsqueda de usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newValue = value;

      if (name === "phone") {
        let cleanedValue = value.replace(/\D/g, "");
        if (cleanedValue.startsWith("57")) {
          cleanedValue = cleanedValue.slice(2);
        }
        newValue = `+57${cleanedValue.slice(0, 10)}`;
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.role.trim()) {
      errors.push("El rol es obligatorio.");
    }

    if (!formData.name.trim()) {
      errors.push("El nombre completo es obligatorio.");
    }

    if (!formData.documentType.trim()) {
      errors.push("El tipo de documento es obligatorio.");
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

    if (!validateForm()) return;

    const userData = {
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
      await updateUser(formData.id, userData);
      toast.success("Usuario actualizado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/user/list");
    } catch (error) {
      handleServerError(error);
    }
  };

  const handleServerError = (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          if (data.errors) {
            data.errors.forEach((err) =>
              toast.error(err.message, {
                position: "top-right",
                autoClose: 3000,
              })
            );
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
  };

  const handleCancel = () => {
    navigate("/admin/user/list");
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <AdminLayout title="Editar Usuario">
      {formData && (
        <UserForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isEditMode={true}
        />
      )}
    </AdminLayout>
  );
}
