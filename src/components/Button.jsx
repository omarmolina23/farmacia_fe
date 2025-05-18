import React from "react";

const Button = ({
  type = "button",
  disabled = false  ,
  title,
  onClick,
  color,
  icon,
  textColor = "text-white",
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${color} ${textColor} inline-flex items-center justify-center gap-2 font-semibold py-2 px-6 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 ease-in-out hover:bg-opacity-80 focus:ring-2 focus:ring-gray-300 shadow-md active:scale-95`}
      aria-label={title}
    >
      {icon && <span className="text-[#8B83BA] text-xl">{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
