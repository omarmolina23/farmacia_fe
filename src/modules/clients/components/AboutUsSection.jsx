import React from "react";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const AboutUsSection = () => {
  return (
    <section className="bg-[#939D72] py-16 px-8 w-full relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Título principal: ¿Quiénes somos? */}
        <div className="text-center">
          <h2 className="text-white text-6xl mb-8" style={fontStyle}>
            ¿Quienes somos?
          </h2>
        </div>

        {/* Título alineado hacia abajo */}
        <div className="sm:text-left text-center">
          <h3
            className="text-[#000000] text-4xl sm:text-5xl font-bold mb-2"
            style={fontStyle}
          >
            Drogueria
          </h3>
          <h1 className="text-white text-5xl sm:text-6xl font-extrabold mb-4">
            Nueva Esperanza
          </h1>
        </div>

        {/* Contenedor para la imagen y el texto descriptivo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Imagen frente al texto */}
          <div className="flex-shrink-0">
            <img
              src="/img/pharmacy.png"
              alt="Pharmacy"
              className="w-45 h-45 sm:w-70 sm:h-70 -mt-15"
            />
          </div>

          {/* Texto descriptivo alineado a la derecha en escritorio, centrado en móvil */}
          <div className="sm:text-right text-center">
            <p className="text-white text-lg leading-relaxed">
              Diseñada para ayudar a mejorar la atención al cliente en la
              búsqueda de medicamentos y proporcionar parámetros de búsqueda
              según los síntomas del paciente. Diseñada para ayudar a mejorar la
              atención al cliente en la búsqueda de medicamentos y proporcionar
              parámetros de búsqueda según los síntomas del paciente.
            </p>
          </div>
        </div>

        {/* Sección de Misión y Visión */}
        <div className="relative">
          {/* Contenedor de Misión y Visión */}
          <div className="pl-0 sm:pl-80 flex flex-col gap-16">
            {/* Misión */}
            <div className="sm:text-left text-center">
              <h4 className="text-black text-5xl font-bold mb-4">Misión</h4>
              <p className="text-white text-lg leading-relaxed sm:text-right text-center">
                Brindar a la comunidad del barrio Nueva Esperanza acceso a
                medicamentos, insumos médicos y productos de salud de calidad
                garantizando un servicio confiable, amable y profesional,
                comprometidos con el bienestar de nuestros clientes a través de
                una atención personalizada y productos accesibles que satisfagan
                sus necesidades con eficiencia y responsabilidad.
              </p>
            </div>

            {/* Visión */}
            <div className="sm:text-right text-center">
              <h4 className="text-black text-5xl font-bold mb-4">Visión</h4>
              <p className="text-white text-lg leading-relaxed sm:text-left text-center">
                Ser la droguería de referencia en el barrio Nueva Esperanza y
                sus alrededores, reconocida por su compromiso con la salud, su
                excelente servicio al cliente y la confianza de la comunidad,
                buscando expandir nuestra oferta de productos y servicios,
                manteniéndonos a la vanguardia en el sector farmacéutico y
                consolidándonos como un establecimiento de salud integral.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Imagen decorativa solo visible en pantallas grandes */}
      <img
        src="/img/hand.png"
        alt="Hand with pills"
        className="hidden sm:block absolute left-0 bottom-0 w-100 sm:w-116 h-auto"
      />
    </section>
  );
};

export default AboutUsSection;
