import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct as createProductService } from "../../services/ProductService";
import ProductLayout from "../../modules/admin/product/layout/ProductLayout";
import ProductForm from "../../modules/admin/product/components/ProductForm";
import { Weight } from "lucide-react";

export default function ProductRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "ACTIVE",
    categoryId: "",
    concentration: "",
    activeIngredient: "",
    weight: "",
    volume: "",
    ProductTag: [],
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeImage = (imageList) => {
    const urls = imageList.map((image) => image);
    setFormData({ ...formData, images: urls });
  };

  const handleChangeTags = (selectedOptions) => {
    const selectedTags = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, ProductTag: selectedTags });
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("El nombre del producto es obligatorio.");
    }

    if (!formData.price || isNaN(formData.price)) {
      errors.push("El precio debe ser un número válido.");
    }

    if (!formData.categoryId || formData.categoryId === "") {
      errors.push("La categoría es obligatoria.");
    }

    if (errors.length > 0) {
      errors.forEach((error) =>
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
        })
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      ...formData,
      ProductTag: JSON.stringify(formData.ProductTag),
    };

    if (!validateForm()) return;

    try {
      await createProductService(formDataToSend);
      toast.success("Producto creado con éxito", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/product/list");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/product/list");
  };

  return (
    <ProductLayout title="Registrar producto">
      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleChangeImage={handleChangeImage}
        handleChangeTags={handleChangeTags}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        isEditMode={false}
      />
    </ProductLayout>
  );
}
