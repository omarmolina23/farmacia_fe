import React, { useEffect, useState } from "react";
import { getCategoryAll } from "../../../services/CategoryService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  useEffect(() => {
    fetchCategories();
  }, [filterStatus]);

  const fetchCategories = () => {
    getCategoryAll()
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter(
            (category) => category?.status === filterStatus
          );
          setCategories(filtered);
        }
      })
      .catch((error) => {
        toast.error("Error al obtener categorías");
      });
  };

  return (
    <footer className="bg-gray-200 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center md:text-left">
        {/* Categorías */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-black font-bold text-lg mb-4">Categorías</h3>
          <ul className="space-y-2 text-gray-700">
            {categories.slice(0, 5).map((category) => (
              <li key={category.id}>
                <span className="hover:underline">{category.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Droguería */}
        <div className="flex flex-col items-center">
          <h3 className="text-black font-bold text-lg mb-4">Droguería</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link to="/about" className="hover:underline">
                Misión - Visión
              </Link>
            </li>
          </ul>
        </div>

        {/* Conoce */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-black font-bold text-lg mb-4">Conoce</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Historial de compras</li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria y logo */}
      <div className="border-t border-gray-300 mt-10 pt-8 flex flex-col items-center">
        <div className="bg-[#4CAF50] w-12 h-12 rounded-full flex items-center justify-center">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-7 sm:h-9 rounded-full"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
