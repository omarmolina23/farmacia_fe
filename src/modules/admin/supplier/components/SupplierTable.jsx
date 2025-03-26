import { Eye, EyeOff } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { deleteSupplier, updateSupplier } from "../../../../services/SupplierService";
import { toast } from "react-toastify";

const SupplierTable = ({ index, id, name, phone, email, status, refreshList }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        const supplierData = { id, name, phone, email, status };
        localStorage.setItem("supplierData", JSON.stringify(supplierData));
        navigate(`/admin/supplier/update`);
    };

    const handleToggleStatus = async () => {
        const isActive = status === "ACTIVE";
        const action = isActive ? deleteSupplier(id) : updateSupplier(id, { status: "ACTIVE" });
    
        Swal.fire({
            customClass: {
                confirmButton: "bg-[#8B83BB] text-black",
                cancelButton: "bg-[#FFFFFF] text-black",
                icon: "text-mb mx-auto",
                title: "!font-semibold !mt-2 !text-gray-900 !text-mb !mx-auto",
                text: "!font-medium !text-gray-500 !text-mb !mx-auto",
            },
            popup: "swal2-show",
            title: `¿${isActive ? "Deshabilitar" : "Habilitar"} proveedor?`,
            text: "Esta acción cambiará el estado del proveedor",
            icon: "warning",
            showCancelButton: true,
            iconColor: "#000000",
            confirmButtonText: `Sí, ${isActive ? "deshabilitar" : "habilitar"}`,
            cancelButtonText: "No, cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await action;
                    toast.success(`Proveedor ${isActive ? "deshabilitado" : "habilitado"}`);
                    refreshList();
                } catch (error) {
                    console.error("Error al cambiar el estado del proveedor:", error);
                    toast.error(`Error al ${isActive ? "deshabilitar" : "habilitar"} el proveedor`);
                }
            }
        });
    };

    return (
        <>
            <tr className='text-left h-8 align-middle'>
                <td className="pl-5">#{index + 1}</td>
                <td className="pl-2">{name}</td>
                <td>{phone}</td>
                <td>{email}</td>
                <td className="flex flex-row p-1">
                    <div
                        className="flex flex-row items-center cursor-pointer hover:bg-[#f1d167] w-fit m-[1px] px-[3px] rounded-sm mr-4"
                        onClick={handleEditClick}
                    >
                        <FaEdit size={16} className="mr-2 text-[#232323]" />Editar
                    </div>
                    {status === "ACTIVE" ? (
                        <div
                            className="flex flex-row items-center cursor-pointer hover:bg-[#F16767] w-fit m-[1px] px-[3px] rounded-sm"
                            onClick={handleToggleStatus}
                        >
                            <EyeOff size={16} className='mr-2 text-[#181818]' />
                            Deshabilitar
                        </div>
                    ) : (
                        <div
                            className="flex flex-row items-center cursor-pointer hover:bg-[#AAF167] w-fit m-[1px] px-[3px] rounded-sm"
                            onClick={handleToggleStatus}
                        >
                            <Eye size={16} className='mr-2 text-[#181818]' />
                            Habilitar
                        </div>
                    )}
                </td>
            </tr>
            <tr>
                <td colSpan="5">
                    <hr />
                </td>
            </tr>
        </>
    );
};

export default SupplierTable;