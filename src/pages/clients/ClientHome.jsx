import React from "react";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import CategorySection from "../../modules/clients/components/CategorySection";

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

    <CategorySection />  
    </ClientLayout>
  );
};

export default ClientHome;
