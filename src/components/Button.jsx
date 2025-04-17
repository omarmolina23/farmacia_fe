import React from "react";

const Button = ({ type = "button", title, onClick, color, textColor = "text-white"}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${color} ${textColor} font-semibold py-1.5 px-4 sm:px-8 md:px-10 lg:px-12 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 ease-in-out hover:bg-opacity-80 focus:ring-2 focus:ring-gray-300 shadow-md active:scale-95`}
      aria-label={title}
    >
      {title}
    </button>
  );
};

export default Button;
