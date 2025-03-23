import React from "react";

const Button = ({ type, title, onClick }) => {
  return (
    <button
      type={type}
      className="bg-[#D0F25E] py-2 px-10 rounded-lg text-lg hover:bg-[#97b33c] shadow cursor-pointer"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
