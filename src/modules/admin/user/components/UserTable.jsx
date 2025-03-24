import { PiEyeSlash } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ index, id, name, phone, email, age, status }) => {

    const navigate = useNavigate();
    const handleEditClick = () => {
        const supplierData = { id, name, phone, email, age, status };
        localStorage.setItem("supplierData", JSON.stringify(supplierData));
        navigate(`/supplier-update`);
    };

    return (
        <>
            <tr className='text-left h-8 align-middle'>
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
                        <FaEdit size={16} className="mr-2 text-[#232323]" />Editar
                    </div>
                    <div
                        className='flex flex-row items-center cursor-pointer hover:bg-[#d13737] w-fit m-[1px] px-[3px] rounded-sm'
                    >
                        <EyeOff size={16} className='mr-2 text-[#181818]' />Deshabilitar
                    </div>
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