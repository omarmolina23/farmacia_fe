import React from "react";

const Button = ({ type, title, onClick, color }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${color} py-2 px-10 rounded-lg text-lg hover:bg-[#DADDD1] shadow cursor-pointer`}
    >
      {title}
    </button>
  );
};

export default Button;
