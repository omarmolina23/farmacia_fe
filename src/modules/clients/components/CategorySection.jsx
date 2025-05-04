import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { getCategoryAll } from "../../../services/CategoryService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const CategorySection = () => {
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
      .catch(() => {
        toast.error("Error al obtener categorías");
      });
  };

  return (
    <section className="bg-[#B6AEF2] py-12 px-4 sm:px-8 w-full">
      <div className="flex flex-col items-center max-w-6xl mx-auto mb-8">
        <h2
          className="text-[#FFFFFF] text-center text-4xl sm:text-5xl font-bold mb-10 sm:mb-12"
          style={fontStyle}
        >
          Categorias de productos
        </h2>

        {/* Render cards */}
        <div className="flex justify-center flex-wrap gap-6 sm:gap-8 w-full">
          {categories.length === 0 ? (
            <p className="text-white text-center">No hay categorías disponibles</p>
          ) : (
            categories.slice(0, 8).map((category) => (
              <CategoryCard 
              key={category.id} 
              title={category.name} 
              link={`/catalog?category=${encodeURIComponent(category.name)}`} 
              colors={{
                top: "#87CEEB", // Azul claro
                left: "#4682B4", // Azul acero
                right: "#5F9EA0", // Azul cadete
              }} />
            ))
          )}
        </div>

        {/* Botón explorar más */}
        <div className="flex justify-center mt-10 sm:mt-12">
          <button className="flex items-center justify-center gap-2 border border-black text-black font-bold py-3 px-6 rounded-lg shadow-md transition-all hover:bg-black hover:text-white">
            Explorar más
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
