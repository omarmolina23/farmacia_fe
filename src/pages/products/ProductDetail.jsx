import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductLayout from "../../modules/admin/product/layout/ProductLayout";
import ProductInfo from "../../modules/admin/product/components/ProductInfo";

export default function ProductDetail() {
  const navigate = useNavigate();

  const { id } = useParams();

  const hasShownToast = useRef(false);

  const [detailData, setDetailData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    status: "",
    concentration: "",
    activeIngredient: "",
    weight: "",
    volume: "",
    images: [],
    tags: [],
  });

  useEffect(() => {
    const storedProduct = localStorage.getItem("productData");
    if (storedProduct && JSON.parse(storedProduct).id === id) {
      setDetailData(JSON.parse(storedProduct));
    } else {
      if (!hasShownToast.current) {
        toast.error("No se encontró el producto.", {
          position: "top-right",
          autoClose: 3000,
        });
        hasShownToast.current = true;
      }
    }
  }, []);

  const handleCancel = () => {
    setDetailData({
      name: "",
      description: "",
      category: "",
      price: "",
      status: "",
      concentration: "",
      activeIngredient: "",
      weight: "",
      volume: "",
      images: [],
    });

    localStorage.removeItem("productData");
    navigate("/admin/product/list");
  };

  return (
    <ProductLayout title="Detalles del producto">
      <ProductInfo elementData={detailData} handleCancel={handleCancel} />
    </ProductLayout>
  );
}
