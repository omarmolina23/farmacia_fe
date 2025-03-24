import { Link } from "react-router-dom";
import { FiHome, FiArchive, FiLogOut } from "react-icons/fi";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { signOut as signOutService } from "../../../services/UserService";

export default function AdminSideBar() {
    const [isInventarioOpen, setIsInventarioOpen] = useState(false);

    const { signOut } = useAuth();

    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOutService();  
        signOut();  
        navigate("/");
    }

    return (
        <div className="flex flex-col bg-[#D9D9D9] w-[16rem] h-screen">
            <div className="flex flex-row h-[70px] max-w-fit mx-3 items-center my-3">
                <img className="bg-white h-14 w-14 rounded-full mr-2 object-contain" src="/img/logo.png" alt="Logo" />
                <img className="h-auto w-[63%]" src="/img/textLogo.png" alt="textLogo" />
            </div>
            <hr className="mb-1 border-[#1e1e1e63]" />
            <div className="flex-1 overflow-y-auto">
                <ul className="list-none py-[1rem] px-[2rem]">
                    <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                        <Link className="flex flex-row items-center" to="/inicio">
                            <FiHome className="mr-4 text-xl" /> Inicio
                        </Link>
                    </li>
                    <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                        <Link className="flex flex-row items-center" to="/ver_ventas">
                            <LuCircleDollarSign className="mr-4 text-xl" /> Ventas
                        </Link>
                    </li>
                    <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                        <Link className="flex flex-row items-center" to="/prediccion">
                            <BsStars className="mr-4 text-xl" /> Predicción
                        </Link>
                    </li>
                    <li className="flex flex-col">
                        <button
                            className="flex flex-row mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300 w-full text-left"
                            onClick={() => setIsInventarioOpen(!isInventarioOpen)}
                        >
                            <div className="flex-1 flex items-center">
                                <FiArchive className="mr-4 text-xl" /> Inventario
                            </div>
                            {isInventarioOpen ? (
                                <IoIosArrowDown className="text-xl" />
                            ) : (
                                <IoIosArrowForward className="text-xl" />
                            )}
                        </button>
                        {isInventarioOpen && (
                            <ul className="mx-2 ml-2 bg-[#fffcfca8] rounded-md transition-all duration-300">
                                <li className="py-[10px] px-[20px] flex flex-row hover:bg-[#6aa7e038] transition-colors duration-300">
                                    <Link className="flex flex-row items-center" to="/ver_categorias">
                                        <IoIosArrowForward className="mr-4 text-xl" /> Categorías
                                    </Link>
                                </li>
                                <li className="py-[10px] px-[20px] flex flex-row hover:bg-[#6aa7e038] transition-colors duration-300">
                                    <Link className="flex flex-row items-center" to="/supplier-list">
                                        <IoIosArrowForward className="mr-4 text-xl" /> Proveedores
                                    </Link>
                                </li>
                                <li className="py-[10px] px-[20px] flex flex-row hover:bg-[#6aa7e038] transition-colors duration-300">
                                    <Link className="flex flex-row items-center" to="/listar_productos">
                                        <IoIosArrowForward className="mr-4 text-xl" /> Productos
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
            <div className="flex justify-end items-center p-3">
                <Link to="/user-list">
                    <FaUsers className="text-3xl cursor-pointer hover:text-[#8B83BA] transition-colors duration-300" />
                </Link>
            </div>
            <hr className="mb-4 border-[#1e1e1e63]" />
            <div className="flex flex-row h-[70px] max-w-fit mx-3 items-center mb-3">
                <div className="bg-white h-14 w-14 rounded-full mr-2 flex justify-center items-center">
                    <FaUserAlt className="text-4xl" />
                </div>
                <div className="flex flex-col">
                    <h5 className="font-semibold">Administrador</h5>
                    <button
                        name="cerrarSesion"
                        className="flex flex-row items-center text-black hover:text-[#8B83BA] transition-colors duration-300 cursor-pointer"
                        onClick={handleSignOut}
                    >
                        <FiLogOut className="text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}