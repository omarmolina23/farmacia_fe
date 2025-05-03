import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { createBatch } from "../../services/BatchService";
import { searchProductByNameOrId } from "../../services/ProductService";
import BatchLayout from "../../modules/admin/batch/layout/BatchLayout";
import BatchForm from "../../modules/admin/batch/components/BatchForm";

export default function BatchRegister() {
  const defaultFormData = {
    productId: "",
    expirationDate: "",
    status: "ACTIVE",
    isExpired: false,
    number_batch: "",
    amount: 0,
    purchaseValue: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [product, setProduct] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const results = await searchProductByNameOrId(id);

      if (results.length > 0) {
        const product = results[0];

        setFormData({
          ...formData,
          productId: product.id,
        });

        setProduct(product.name);
      } else {
        toast.error("Producto no encontrado");
        navigate("/admin/product/list");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      toast.error("Error en la búsqueda de productos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "productId",
      "expirationDate",
      "number_batch",
      "amount",
      "purchaseValue",
    ];
    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        const fieldNameMap = {
          productId: "Producto",
          expirationDate: "Fecha de vencimiento",
          number_batch: "Número de lote",
          amount: "Cantidad",
        };
        toast.error(`El campo ${fieldNameMap[field]} es obligatorio.`);
        return false;
      }
    }
    if (isNaN(formData.amount) || formData.amount <= 0) {
      toast.error("La cantidad debe ser un número mayor a cero.");
      return false;
    }

    if (isNaN(formData.purchaseValue) || formData.purchaseValue <= 0) {
      toast.error("El valor total debe ser un valor mayor a cero.");
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.expirationDate)) {
      toast.error("La fecha debe tener el formato válido YYYY-MM-DD.");
      return false;
    }

    const expirationTemp = new Date(formData.expirationDate);
    const isValidDate = !isNaN(expirationTemp.getTime());
    if (!isValidDate) {
      toast.error("La fecha ingresada no es válida.");
      return false;
    }

    const today = new Date();
    const expiration = new Date(formData.expirationDate);
    today.setHours(0, 0, 0, 0);

    if (expiration <= today) {
      toast.error("La fecha de vencimiento debe ser posterior a hoy");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      purchaseValue: Number(formData.purchaseValue),
    };

    try {
      await createBatch(payload);
      toast.success("Lote creado exitosamente", { autoClose: 3000 });
      setFormData(defaultFormData);
      navigate("/admin/product/list");
    } catch (error) {
      toast.error(error.message || "Error al crear el lote.");
    }
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    navigate("/admin/product/list");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <BatchLayout title="Registrar Lote">
      <BatchForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        product={product}
      />
    </BatchLayout>
  );
}
