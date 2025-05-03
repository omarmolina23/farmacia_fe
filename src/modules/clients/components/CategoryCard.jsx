import React from "react";

const CategoryCard = ({ title, description, link }) => {
  return (
    <div className="bg-white border border-black rounded-lg shadow-md p-4 flex flex-col justify-between w-[240px] h-[280px]">
      <div>
        <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
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