import React from "react";

const CategoryCard = ({ title, link }) => {
  return (
    <div className="bg-white border border-black rounded-lg shadow-md p-4 flex flex-col justify-between items-center w-[240px] h-[240px]">
      <div className="flex flex-col items-center">
        {/* Título centrado con margen inferior */}
        <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
        {/* Imagen con margen superior */}
        <img
          src="/img/abstract_image.png"
          alt="Medicine"
          className="w-20 h-20 mt-2"
        />
      </div>
      <a
        href={link}
        className="text-[#00B5D8] font-semibold hover:underline mt-4"
      >
        Explorar →
      </a>
    </div>
  );
};

export default CategoryCard;