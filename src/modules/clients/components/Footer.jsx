import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {/* Categorías */}
        <div className="flex flex-col text-left">
          <h3 className="text-black font-bold text-lg mb-4">Categorías</h3>
          <ul className="space-y-2">
            <li>Analgésicos y antiinflamatorios</li>
            <li>
              Antialérgicos <span className="text-blue-500 text-sm">new</span>
            </li>
            <li>Producto 3</li>
            <li>Producto 4</li>
            <li>Producto 5</li>
          </ul>
        </div>

        {/* Droguería */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-black font-bold text-lg mb-4">Droguería</h3>
          <ul className="space-y-2">
            <li>Misión - Visión</li>
            <li>Proveedores</li>
            <li>Contacto</li>
          </ul>
        </div>

        {/* Conoce */}
        <div className="flex flex-col items-end text-right">
          <h3 className="text-black font-bold text-lg mb-4">Conoce</h3>
          <ul className="space-y-2">
            <li>Historial de compras</li>
            <li>Detalles de facturas</li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria y logo */}
      <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col items-center">
        <div className="bg-[#4CAF50] w-12 h-12 rounded-full flex items-center justify-center">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-7 sm:h-9 rounded-full"
          />
        </div>
        <p className="text-gray-600 text-sm mt-4">
          © 2025. Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;