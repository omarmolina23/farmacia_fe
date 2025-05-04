import React from "react";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import Footer from "../../modules/clients/components/Footer";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const ClientHome = () => {
  return (
    <ClientLayout title="Client Home">
      {/* Sección principal */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Columna de texto */}
          <div className="flex flex-col items-start gap-6">
            <h2
              className="text-[#4CAF50] font-bold text-4xl sm:text-5xl"
              style={fontStyle}
            >
              Drogueria
            </h2>
            <h1 className="text-black font-extrabold text-6xl sm:text-7xl">
              Nueva Esperanza
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
              Diseñada para ayudar a mejorar la atención al cliente en la
              búsqueda de medicamentos y proporcionar parámetros de búsqueda
              según los síntomas del paciente.
            </p>
            <button className="bg-[#C0DAE5] hover:bg-[#c4e556] text-black font-bold py-3 px-6 rounded-lg shadow-md transition-all">
              Conocer más
            </button>
          </div>

          {/* Columna de imágenes */}
          <div className="flex justify-center items-center bg-[#F5F9FF] h-full">
            {/* Aquí irán las imágenes */}
            <div className="w-full h-full bg-[#F5F9FF] shadow-lg">
              {/* Placeholder para imágenes */}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de categorías */}
      <section className="bg-[#B6AEF2] py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-center text-4xl font-bold mb-12"
            style={fontStyle}
          >
            categorías de productos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarjetas de categorías */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Analgésicos</h3>
              <p className="text-gray-600 mb-4">
                Fármacos destinados a aliviar el dolor físico.
              </p>
              <a
                href="#"
                className="text-blue-500 font-semibold hover:underline"
              >
                Explorar →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Antialérgicos</h3>
              <p className="text-gray-600 mb-4">
                Destinados a combatir los efectos negativos producidos por una
                hipersensibilidad o una reacción alérgica.
              </p>
              <a
                href="#"
                className="text-blue-500 font-semibold hover:underline"
              >
                Explorar →
              </a>
            </div>

            {/* Tarjetas genéricas */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Tipo de medicamento</h3>
                <p className="text-gray-600 mb-4">Breve descripción.</p>
                <a
                  href="#"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Explorar →
                </a>
              </div>
            ))}
          </div>

          {/* Botón explorar más */}
          <div className="text-center mt-12">
            <button className="bg-[#C0DAE5] hover:bg-[#B0CFE0] text-black font-bold py-3 px-6 rounded-lg shadow-md transition-all">
              Explorar más →
            </button>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};

export default ClientHome;