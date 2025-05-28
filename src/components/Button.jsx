import React from "react";

const Button = ({
  type = "button",
  disabled = false,
  title,
  onClick,
  color,
  icon,
  textColor = "text-white",
  small = false,
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-gray-300 shadow-md active:scale-95";
  const sizeClasses = small
    ? "py-1 px-3 text-xs sm:text-sm md:text-sm"
    : "py-2 px-6 text-sm sm:text-base md:text-lg";
  const hoverClasses = "hover:bg-opacity-90 hover:scale-105";

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${color} ${textColor} ${baseClasses} ${sizeClasses} ${hoverClasses}`}
      aria-label={title}
    >
      {icon && <span className="text-[#8B83BA] text-xl">{icon}</span>}
      {title}
    </button>
  );
};

export default Button;
