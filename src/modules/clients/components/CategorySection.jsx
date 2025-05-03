import React from 'react';
import CategoryCard from './CategoryCard';

const fontStyle = {
    fontFamily: "'Nanum Pen Script', cursive",
  };

const CategorySection = () => {
    return (

        
        /* Sección de categorías */
      <section className="bg-[#B6AEF2] py-16 w-full">
      <div className="flex justify-center flex-wrap gap-8 max-w-5xl mx-auto mb-8">
      <h2
            className="text-[#FFFFFF] text-center text-5xl font-bold mb-12"
            style={fontStyle}
          >
            categorias de productos
          </h2>
        {/* Fila con 2 tarjetas */}
        <div className="flex justify-center gap-8 w-full">
            
          <CategoryCard
            title="Analgésicos"
            description="Fármacos destinados a aliviar el dolor físico."
            link="#"
          />
          <CategoryCard
            title="Antialérgicos"
            description="Destinados a combatir los efectos negativos producidos por una hipersensibilidad o una reacción alérgica."
            link="#"
          />
        </div>

        {/* Fila con 3 tarjetas */}
        <div className="flex justify-center gap-8 w-full">
          {[...Array(3)].map((_, index) => (
            <CategoryCard
              key={index}
              title="Tipo de medicamento"
              description="Breve descripción."
              link="#"
            />
          ))}
        </div>

        {/* Botón explorar más */}
        <div className="flex justify-center mt-12">
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