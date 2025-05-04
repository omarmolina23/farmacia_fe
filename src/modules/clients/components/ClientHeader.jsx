import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import ClientHeaderItems from "./ClientHeaderItems";

const ClientHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearch(query) {
    navigate(`/catalog?query=${query}`);
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-[#D0F25E] p-4 z-50 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo y Navbar */}
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2" to="/">
            <img
              src="/img/logo.png"
              alt="Logo"
              className="h-12 sm:h-14 rounded-full" // Clase para hacerlo circular
            />
            </Link>
            <Link to="/">
            <img
              src="/img/textLogo.png"
              alt="Texto Logo"
              className="h-12 sm:h-14"
            />
          </Link>

          <div className="hidden xl:block">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Menú Desktop */}
        <nav className="hidden xl:flex items-center gap-8">
          <ClientHeaderItems />
        </nav>

        {/* Botón Hamburguesa */}
        <button
          className="xl:hidden text-black text-2xl"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú móvil con animación */}
      <div
        className={`xl:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex flex-col gap-4 mt-4 px-1">
          <SearchBar onSearch={handleSearch} resizable={false} />
          <ClientHeaderItems />
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
