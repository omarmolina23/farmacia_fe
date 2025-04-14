import { PiEyeSlash } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../../services/UserService";

const UserTable = ({ id, documentType, name, phone, email, age, status, refreshList }) => {
  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate(`/admin/user/update/${id}`);
  };

  const handleToggleUserStatus = async () => {
    Swal.fire({
      customClass: {
        confirmButton: "bg-[#8B83BB] text-black",
        cancelButton: "bg-[#FFFFFF] text-black",
        icon: "text-mb mx-auto",
        title: "!font-semibold !mt-2 !text-gray-900 !text-mb !mx-auto",
        text: "!font-medium !text-gray-500 !text-mb !mx-auto",
      },
      popup: "swal2-show",
      title:
        status === "ACTIVE" ? "¿Deshabilitar usuario?" : "¿Habilitar usuario?",
      text: "Esta acción cambiará el estado del usuario",
      icon: "warning",
      showCancelButton: true,
      iconColor: "#000000",
      confirmButtonText:
        status === "ACTIVE" ? "Sí, deshabilitar" : "Sí, habilitar",
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          await updateUser(id, { status: newStatus });
          toast.success(
            `Usuario ${newStatus === "ACTIVE" ? "habilitado" : "deshabilitado"
            } correctamente`
          )
          refreshList();
        } catch (error) {
          console.error("Error al cambiar el estado del usuario:", error);
          toast.error("Error al cambiar el estado del usuario");
        }
      }
    });
  };

  return (
    <>
      <tr className="text-left h-8 align-middle border-b">
        <td className="pl-5 hidden lg:table-cell">{documentType}</td>
        <td className="pl-4">{id}</td>
        <td className="pl-4">{name}</td>
        <td className="hidden md:table-cell">{phone}</td>
        <td className="hidden md:table-cell">{email}</td>
        <td className="hidden lg:table-cell">{age}</td>
        <td className="flex flex-wrap gap-2 p-1">
          <div
            className="flex items-center cursor-pointer hover:bg-[#f1d167] px-2 py-1 rounded"
            onClick={handleEditClick}
          >
            <FaEdit size={16} className="mr-1 text-[#232323]" />
            Editar
          </div>
          {status === "ACTIVE" ? (
            <div
              className="flex items-center cursor-pointer hover:bg-[#d13737] px-2 py-1 rounded"
              onClick={handleToggleUserStatus}
            >
              <EyeOff size={16} className="mr-1 text-[#181818]" />
              Deshabilitar
            </div>
          ) : (
            <div
              className="flex items-center cursor-pointer hover:bg-[#AAF167] px-2 py-1 rounded"
              onClick={handleToggleUserStatus}
            >
              <Eye size={16} className="mr-1 text-[#181818]" />
              Habilitar
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default UserTable;
