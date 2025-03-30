import { Eye, EyeOff } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteCategory,
  updateCategory,
} from "../../../../services/CategoryService";

const CategoryTable = ({ index, id, name, status, refreshList }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    const categoryData = { id, name, status };
    localStorage.setItem("categoryData", JSON.stringify(categoryData));
    navigate(`/admin/category/update`);
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
      title: `¿${isActive ? "Deshabilitar" : "Habilitar"} categoría?`,
      text: "Esta acción cambiará el estado de la categoría",
      icon: "warning",
      showCancelButton: true,
      iconColor: "#000000",
      confirmButtonText: `Sí, ${isActive ? "deshabilitar" : "habilitar"}`,
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const action = isActive
            ? deleteCategory(id)
            : updateCategory(id, { status: "ACTIVE" });

          await action; // Ejecutar la acción aquí, solo si el usuario confirma
          toast.success(
            `Categoría ${isActive ? "deshabilitada" : "habilitada"}`
          );
          refreshList();
        } catch (error) {
          console.error("Error al cambiar el estado de la categoria:", error);
          toast.error(
            `Error al ${isActive ? "deshabilitar" : "habilitar"} la categoría`
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
        <td className="flex flex-col md:flex-row p-1 gap-2">
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
        </td>
      </tr>
    </>
  );
};

export default CategoryTable;
