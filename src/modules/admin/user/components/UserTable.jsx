import { PiEyeSlash } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../../services/UserService";

const UserTable = ({ id, name, phone, email, age, status }) => {
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
            `Usuario ${
              newStatus === "ACTIVE" ? "habilitado" : "deshabilitado"
            } correctamente`
          );
        } catch (error) {
          console.error("Error al cambiar el estado del usuario:", error);
          toast.error("Error al cambiar el estado del usuario");
        }
      }
    });
  };

  return (
    <>
      <tr className="text-left h-8 align-middle">
        <td className="pl-5">{id}</td>
        <td>{name}</td>
        <td>{phone}</td>
        <td>{email}</td>
        <td>{age}</td>
        <td className="flex flex-row p-1">
          <div
            className="flex flex-row items-center cursor-pointer hover:bg-[#f1d167] w-fit m-[1px] px-[3px] rounded-sm mr-4"
            onClick={handleEditClick}
          >
            <FaEdit size={16} className="mr-2 text-[#232323]" />
            Editar
          </div>
          {status === "ACTIVE" ? (
            <div
              className="flex flex-row items-center cursor-pointer hover:bg-[#d13737] w-fit m-[1px] px-[3px] rounded-sm"
              onClick={handleToggleUserStatus}
            >
              <EyeOff size={16} className="mr-2 text-[#181818]" />
              Deshabilitar
            </div>
          ) : (
            <div
              className="flex flex-row items-center cursor-pointer hover:bg-[#AAF167] w-fit m-[1px] px-[3px] rounded-sm"
              onClick={handleToggleUserStatus}
            >
              <Eye size={16} className="mr-2 text-[#181818]" />
              Habilitar
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td colSpan="6">
          <hr />
        </td>
      </tr>
    </>
  );
};

export default UserTable;
