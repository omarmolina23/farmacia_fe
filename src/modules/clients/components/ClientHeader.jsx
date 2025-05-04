import React, { useState } from "react";
import { FaHistory, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const ClientHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearch(query) {
    navigate(`/catalog?query=${query}`);
  }

  return (
    <header className="bg-[#D0F25E] p-4">
      <div className="flex justify-between items-center">
        {/* Logo y Navbar */}
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2" to="/">
            <img
              src="/img/logo.png"
              alt="Logo"
              className="h-7 sm:h-9 rounded-full" // Clase para hacerlo circular
            />
            <img
              src="/img/textLogo.png"
              alt="Texto Logo"
              className="h-7 sm:h-9"
            />
          </Link>

          <div className="hidden lg:block">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Menú Desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          <a
            href="#about"
            className="text-[#4CAF50] font-bold hover:underline flex items-center gap-1 text-lg"
            style={fontStyle} // Mantener la fuente personalizada
          >
            ¿Quienes somos?
          </a>
          <Link
            to="/catalog"
            className="text-black hover:underline flex items-center gap-1 text-lg"
          >
            Productos
          </Link>

          <a
            href="#cart"
            className="text-black hover:underline flex items-center gap-1 text-lg"
          >
            <FaHistory size={18} /> Mis compras
          </a>
          <a
            href="/login"
            className="text-black hover:underline flex items-center gap-1 text-lg"
          >
            <FaSignInAlt size={30} />
          </a>
        </nav>

        {/* Botón Hamburguesa */}
        <button
          className="lg:hidden text-black text-2xl"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú móvil con animación */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex flex-col gap-4 mt-4 px-1">
          <SearchBar onSearch={handleSearch} resizable={false} />
          <a
            href="#about"
            className="text-[#4CAF50] font-bold hover:underline flex items-center gap-2 text-base"
            style={fontStyle}
          >
            ¿Quiénes somos?
          </a>
          <a
            href="#categories"
            className="text-black hover:underline flex items-center gap-2 text-base"
          >
            Categorías <IoIosArrowDown size={14} />
          </a>
          <a
            href="#cart"
            className="text-black hover:underline flex items-center gap-2 text-base"
          >
            <FaHistory size={14} /> Mis compras
          </a>
          <a
            href="/login"
            className="text-black hover:underline flex items-center gap-2 text-base"
          >
            <FaSignInAlt size={16} /> Iniciar sesión
          </a>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
