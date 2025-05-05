import React from "react";
import { Link } from "react-router-dom";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const fontStyle2 = {
  fontFamily: "'Inter'",
};

const MainSection = () => {
  return (
    <section className="relative p-0 m-0">
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch w-full">
        {/* Columna de texto */}
        <div className="flex flex-col justify-center md:items-start items-center md:text-left text-center w-full max-w-xl mx-auto z-10 py-8 gap-8 md:gap-6 md:py-0 px-4">
          <h2
            className="text-[#4CAF50] font-bold text-4xl sm:text-5xl"
            style={fontStyle}
          >
            Drogueria
          </h2>
          <h1
            className="text-black font-extrabold text-6xl sm:text-7xl"
            style={fontStyle2}
          >
            Nueva Esperanza
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Diseñada para ayudar a mejorar la atención al cliente en la búsqueda
            de medicamentos y proporcionar parámetros de búsqueda según los
            síntomas del paciente.
          </p>
          <Link to="/about">
            <button
              className="bg-[#C0DAE5] hover:brightness-90 text-black font-bold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              aria-label="Conocer más sobre Drogueria Nueva Esperanza"
            >
              Conocer más
            </button>
          </Link>
        </div>

        {/* Imagen: solo visible en md en adelante */}
        <div className="hidden md:flex w-full h-full justify-end items-center">
          <img
            src="/img/mainSection.png"
            alt="Main Section"
            className="max-w-[740px] w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default MainSection;
