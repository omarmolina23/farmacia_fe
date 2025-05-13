import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import ProductForm from "../../modules/admin/product/components/ProductForm";
import Loading from "../../components/Loading";
import "react-toastify/dist/ReactToastify.css";
import {
  updateProduct as updateProductService,
  searchProductByNameOrId,
} from "../../services/ProductService";

export default function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toastShownRef = useRef(false);

  const fetchProduct = async () => {
    try {
      const response = await searchProductByNameOrId(id);

      if (response.length > 0) {
        setFormData({
          id: response[0].id ?? "",
          name: response[0].name ?? "",
          description: response[0].description ?? "",
          status: response[0].status ?? "ACTIVE",
          categoryId: response[0].categoryId ?? "",
          supplierId: response[0].supplierId ?? "",
          price: response[0].price ?? "",
          concentration: response[0].concentration ?? "",
          activeIngredient: response[0].activeIngredient ?? "",
          weight: response[0].weight ?? "",
          volume: response[0].volume ?? "",
          ProductTag: response[0].ProductTag.map((tag) => tag) ?? [],
          images: response[0].images ?? [],
        });
      } else {
        if (!toastShownRef.current) {
          toastShownRef.current = true;
          toast.error("Producto no encontrado");
        }
        navigate("/admin/product/list");
      }
    } catch (error) {
      toast.error("Error en la búsqueda de productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? Number(value) : value,
    });
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

    const tags = formData.ProductTag.map((tag) => {
      if (tag.value) {
        return tag.value;
      }

      return tag.tag?.id || tag.id;
    });

    const formDataToSend = {
      ...formData,
      ProductTag: JSON.stringify(tags),
    };

    if (!validateForm()) return;

    
    try {
      await updateProductService(id, formDataToSend);
      toast.success("Producto editado con éxito", {
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
    <AdminLayout title="Editar producto">
      {formData && (
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleChangeImage={handleChangeImage}
          handleChangeTags={handleChangeTags}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isEditMode={true}
        />
      )}
    </AdminLayout>
  );
}
