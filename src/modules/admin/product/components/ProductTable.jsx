import { useState } from "react";
import { Eye, EyeOff, Package, Info } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  updateProduct,
  enableProduct,
} from "../../../../services/ProductService";
import { toast } from "react-toastify";

const ProductTable = ({
  index,
  id,
  name,
  description,
  category,
  supplier, 
  price,
  status,
  concentration,
  activeIngredient,
  weight,
  volume,
  images,
  tags,
  refreshList,
}) => {
  const navigate = useNavigate();

  const [openBatch, setOpenBatch] = useState(false);

  const saveInfo = () => {
    const productData = {
      index,
      id,
      name,
      description,
      category,
      supplier,
      price,
      status,
      concentration,
      activeIngredient,
      weight,
      volume,
      images,
      tags,
      refreshList,
    };
    localStorage.setItem("productData", JSON.stringify(productData));
  };

  const handleEditClick = () => {
    saveInfo();
    navigate(`/admin/product/update/${id}`);
  };

  const handleShowInfo = () => {
    saveInfo();
    navigate(`/admin/product/detail/${id}`);
  };

  const handleToggleStatus = async () => {
    const isActive = status === "ACTIVE";

    Swal.fire({
      customClass: {
        confirmButton: "bg-[#8B83BB] text-black",
        cancelButton: "bg-[#FFFFFF] text-black",
        icon: "text-mb mx-auto",
        title: "!font-semibold !mt-2 !text-gray-900 !text-mb !mx-auto",
        text: "!font-medium !text-gray-500 !text-mb !mx-auto",
      },
      popup: "swal2-show",
      title: `¿${isActive ? "Deshabilitar" : "Habilitar"} producto?`,
      text: "Esta acción cambiará el estado del producto",
      icon: "warning",
      showCancelButton: true,
      iconColor: "#000000",
      confirmButtonText: `Sí, ${isActive ? "deshabilitar" : "habilitar"}`,
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const action = isActive
            ? deleteProduct(id)
            : enableProduct(id);
          await action; // Ejecutar la acción aquí, solo si el usuario confirma
          toast.success(
            `Producto ${isActive ? "deshabilitado" : "habilitado"}`
          );
          refreshList();
        } catch (error) {
          toast.error(
            `Error al ${isActive ? "deshabilitar" : "habilitar"} el producto`
          );
        }
      }
    });
  };

  return (
    <>
      <tr className="text-left h-8 align-middle border-b">
        <td className="pl-5">#{index + 1}</td>
        <td className="pl-2">{name}</td>
        <td className="pl-2">{category}</td>
        <td className="pl-2">{supplier}</td>
        <td className="pl-2">{price}</td>
        <td className="flex flex-col md:flex-row pl-2 p-1 gap-2">
          <div
            className="flex items-center cursor-pointer hover:bg-[#f1d167] w-fit px-[3px] rounded-sm"
            onClick={handleEditClick}
          >
            <FaEdit size={16} className="mr-2 text-[#232323]" />
            <span className="hidden md:inline">Editar</span>
          </div>
          {status === "ACTIVE" ? (
            <div
              className="flex items-center cursor-pointer hover:bg-[#F16767] w-fit px-[3px] rounded-sm"
              onClick={handleToggleStatus}
            >
              <EyeOff size={16} className="mr-2 text-[#181818]" />
              <span className="hidden md:inline">Deshabilitar</span>
            </div>
          ) : (
            <div
              className="flex items-center cursor-pointer hover:bg-[#AAF167] w-fit px-[3px] rounded-sm"
              onClick={handleToggleStatus}
            >
              <Eye size={16} className="mr-2 text-[#181818]" />
              <span className="hidden md:inline">Habilitar</span>
            </div>
          )}

          <div
            className="flex items-center cursor-pointer hover:bg-[#f1d167] w-fit px-[3px] rounded-sm"
            onClick={() => navigate(`/admin/product/batch/${id}`)}
          >
            <Package size={16} className="mr-2 text-[#181818]" />
            <span className="hidden md:inline">Ver lote</span>
          </div>

          <div
            className="flex items-center cursor-pointer hover:bg-[#f1d167] w-fit px-[3px] rounded-sm"
            onClick={handleShowInfo}
          >
            <Info size={16} className="mr-2 text-[#181818]" />
            <span className="hidden md:inline">Ver detalles</span>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductTable;
