import React from "react";

const ServicesSection = () => {
  return (
    <section className="bg-[#B3D9F7] py-16 px-8 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Título de la sección */}
        <h2 className="text-center text-5xl font-bold mb-12" style={{ fontFamily: "'Nanum Pen Script', cursive" }}>
          Servicios
        </h2>

        {/* Contenedor de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Servicio 1 */}
<div className="bg-white rounded-lg shadow-md p-8 text-center border border-black">
  <img
    src="/img/bag.png"
    alt="Venta de Medicamentos"
    className="w-16 h-16 mx-auto mb-4"
  />
  <h3 className="text-2xl font-bold mb-4">
    Venta de Medicamentos y Productos de Salud
  </h3>
  <ul className="text-lg text-gray-700 list-disc list-inside">
    <li>Comercialización de medicamentos de venta libre y bajo fórmula médica.</li>
    <li>Suministro de insumos médicos, productos de cuidado personal y bienestar.</li>
  </ul>
</div>

{/* Servicio 2 */}
<div className="bg-white rounded-lg shadow-md p-8 text-center border border-black">
  <img
    src="/img/stethoscope.png"
    alt="Atención Farmacéutica"
    className="w-16 h-16 mx-auto mb-4"
  />
  <h3 className="text-2xl font-bold mb-4">Atención Farmacéutica</h3>
  <ul className="text-lg text-gray-700 list-disc list-inside">
    <li>Asesoramiento sobre el uso adecuado de medicamentos.</li>
    <li>Información sobre interacciones y efectos secundarios.</li>
  </ul>
</div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;