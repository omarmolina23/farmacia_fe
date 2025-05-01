import React from "react";
import { FaSearch } from "react-icons/fa"; 

const Navbar = () => {
    return (
        <button className="bg-white p-2 rounded-full shadow-md flex items-center justify-center">
          <FaSearch className="text-black" size={16} />
        </button>
      );
};

export default Navbar;