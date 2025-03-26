import { Link } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { LuCircleDollarSign } from "react-icons/lu";
import { FaUserAlt, FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { signOut as signOutService } from "../../../services/UserService";
import { toast } from "react-toastify";

export default function EmployeesSideBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutService();
    signOut();
    toast.success("Sesión cerrada exitosamente");
    navigate("/");
  };

  return (
    <div>
      <button
        className="md:hidden fixed top-4 left-4 z-[200] p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      <div className={`fixed md:relative top-0 left-0 w-[16rem] h-screen bg-[#D9D9D9] transition-transform duration-300 z-[100] ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex flex-row h-[70px] mx-3 items-center my-3">
            <img className="bg-white h-14 w-14 rounded-full mr-2 object-contain" src="/img/logo.png" alt="Logo" />
            <img className="h-auto w-[63%]" src="/img/textLogo.png" alt="textLogo" />
          </div>
          <hr className="mb-1 border-[#1e1e1e63]" />
          <div className="flex-1 overflow-y-auto">
            <ul className="list-none py-[1rem] px-[2rem]">
              <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                <Link className="flex flex-row items-center" to="/registrar_venta">
                  <FaRegEdit className="mr-4 text-xl" /> Registrar Venta
                </Link>
              </li>
              <li className="mb-[10px] p-2 rounded-md hover:bg-[#8B83BA] transition-colors duration-300">
                <Link className="flex flex-row items-center" to="/ver_ventas">
                  <LuCircleDollarSign className="mr-4 text-xl" /> Ver Ventas
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
              <h5 className="font-semibold">Empleado</h5>
              <button
                className="flex flex-row items-center text-black hover:text-[#8B83BA] transition-colors duration-300 cursor-pointer"
                onClick={handleSignOut}
              >
                <FiLogOut className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
