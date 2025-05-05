import React from "react";

const CategoryCard = ({ title, link, imageUrl }) => {
  const fallback = "/img/un-photo.png";
  return (
    <div className="bg-white border border-black rounded-lg shadow-md p-4 flex flex-col justify-between items-center w-[240px] h-[240px]">
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
        <img
          src={imageUrl || fallback}
          alt={`Imagen de ${title}`}
          className="w-24 h-24 object-contain"
        />
      </div>
      <span
        className="text-[#00B5D8] font-semibold hover:underline mt-4"
      >
        Explorar →
      </span>
    </div>
  );
};

export default CategoryCard;