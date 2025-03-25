import { Eye, EyeOff } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteSupplier, updateSupplier } from "../../../../services/SupplierService";
import { toast } from "react-toastify";

const SupplierTable = ({ index, id, name, phone, email, status, refreshList }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        const supplierData = { id, name, phone, email, status };
        localStorage.setItem("supplierData", JSON.stringify(supplierData));
        navigate(`/supplier-update`);
    };

    const handleToggleStatus = async () => {
        try {
            if (status === "ACTIVE") {
                await deleteSupplier(id);
                toast.success("Proveedor deshabilitado");
            } else {
                await updateSupplier(id, { status: "ACTIVE" });
                toast.success("Proveedor habilitado");
            }
            refreshList();
        } catch (error) {
            toast.error("Error al deshabilitar el proveedor");
        }
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