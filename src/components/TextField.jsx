import React from "react";

const TextField = ({ type, id, name, onChange, onWheel, value, placeholder, disabled }) => {
  return (
    <input
      className="p-3 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      type={type}
      id={id}
      name={name} 
      value={value}
      onChange={onChange}
      onWheel={onWheel} // Prevents zooming on mobile devices
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default TextField;
