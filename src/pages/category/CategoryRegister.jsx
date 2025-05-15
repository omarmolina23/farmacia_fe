import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createCategory } from "../../services/CategoryService";
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import CategoryForm from "../../modules/admin/category/components/CategoryForm";

export default function CategoryRegister() {
  const defaultFormData = {
    name: "",
    status: "ACTIVE",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es obligatorio.", {
        position: "top-right",
        autoClose: 3000,
      });
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
      await createCategory(formData);
      toast.success("Categoría creada exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/category/list");
      setFormData(defaultFormData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    navigate("/admin/category/list");
  };

  return (
    <AdminLayout title="Crear categoría">
      <CategoryForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </AdminLayout>
  );
}
