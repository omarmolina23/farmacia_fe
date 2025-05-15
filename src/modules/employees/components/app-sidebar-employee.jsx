import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut } from "react-icons/fi";
import { LuCircleDollarSign } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { useAuth } from "../../../context/authContext";
import { signOut as signOutService } from "../../../services/UserService";
import { toast } from "react-toastify";
import { Sidebar } from "../../../components/ui/sidebar";

export function AppSidebarEmployee({ ...props }) {
    const auth = useAuth();
    const navigate = useNavigate();

    if (!auth) {
        console.error("useAuth debe ser usado dentro de un AuthProvider");
        return null;
    }

    const { signOut } = auth;

    const handleSignOut = async () => {
        await signOutService();
        signOut();
        toast.success("Sesión cerrada exitosamente");
        navigate("/");
    };

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <div className="flex flex-col h-full">
                <div className="flex flex-row h-[70px] mx-3 items-center my-3">
                    <img className="bg-white h-14 w-14 rounded-full mr-2 object-contain" src="/img/logo.png" alt="Logo" />
                    <img className="h-auto w-[63%]" src="/img/textLogo.png" alt="textLogo" />
                </div>
                <hr className="mb-1 border-[#1e1e1e63]" />
                <div className="flex-1 overflow-y-auto">
                    <ul className="list-none py-[1rem] px-[2rem]">
                        <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                            <Link className="flex flex-row items-center" to="/employees/dashboard">
                                <FiHome className="mr-4 text-xl" /> Inicio
                            </Link>
                        </li>
                        <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                            <Link className="flex flex-row items-center" to="/employees/sales/list">
                                <LuCircleDollarSign className="mr-4 text-xl" /> Ventas
                            </Link>
                        </li>
                    </ul>
                </div>
                <hr className="mb-4 border-[#1e1e1e63]" />
                <div className="flex flex-row h-[70px] mx-3 items-center mb-3">
                    <div className="bg-white h-14 w-14 rounded-full mr-2 flex justify-center items-center">
                        <FaUserAlt className="text-4xl" />
                    </div>
                    <div className="flex flex-col">
                        <h5 className="font-semibold">Vendedor</h5>
                        <button
                            className="flex flex-row items-center text-black hover:text-[#8B83BA] transition-colors duration-300 cursor-pointer"
                            onClick={handleSignOut}
                        >
                            <FiLogOut className="text-2xl" />
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>

    );
}
