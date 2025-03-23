import React from "react";
import { IoIosSearch } from "react-icons/io";

const SearchBar = ({ placeholder, value, onChange, className}) => {
  return (
    <div className={`flex items-center border border-black rounded-lg p-2 bg-white ${className}`}>
      <IoIosSearch className="text-[#8B83BA] text-2xl mr-2" />
      <input
        type="text"
        className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
