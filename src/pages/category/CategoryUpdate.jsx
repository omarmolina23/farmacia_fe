import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout";
import "react-toastify/dist/ReactToastify.css";
import { updateCategory } from "../../services/CategoryService";
import CategoryForm from "../../modules/admin/category/components/CategoryForm";

export default function CategoryUpdate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    status: "",
  });

  useEffect(() => {
    const storedCategory = localStorage.getItem("categoryData");
    if (storedCategory) {
      setFormData(JSON.parse(storedCategory));
    } else {
      toast.error("No se encontró la categoría.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, []);

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
      await updateCategory(formData.id, formData);
      toast.success("Categoría actualizada exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/category/list");
      localStorage.removeItem("categoryData");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("categoryData");
    navigate("/admin/category/list");
  };

  return (
    <SupplierLayout title="Editar categoría">
      <CategoryForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </SupplierLayout>
  );
}
