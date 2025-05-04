import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ resizable = true, onSearch = () => {} }) {
  const [open, setOpen] = useState(!resizable);

  function handleKeyUp(e) {
    if (e.keyCode === 13) {
      const value = e.target.value;

      if (value.length === 0) return;

      onSearch(value);
    }
  }

  return (
    <div className="flex items-center bg-white p-2 rounded-full shadow-md">
      <button
        className="p-2 cursor-pointer"
        onClick={() => resizable && setOpen(!open)}
      >
        <FaSearch className="text-black" size={16} />
      </button>
      {open && (
        <input
          type="text"
          className="outline-0 mr-4 ml-2"
          placeholder="Buscar..."
          onKeyUp={handleKeyUp}
        />
      )}
    </div>
  );
}
