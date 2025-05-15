import React from "react";

const ContactSection = () => {
  return (
    <section className="bg-[#C7F490] py-16 px-8 w-full">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Título centrado */}
        <h2
          className="text-center text-7xl"
          style={{ fontFamily: "'Nanum Pen Script', cursive" }}
        >
          contacto
        </h2>

        {/* Contenedor principal */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Contenedor de texto */}
          <div className="flex-1">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">Dirección</h3>
              <p className="text-lg mb-4">Barrio Nueva Esperanza Av. 19</p>
              {/* Mapa de Google Maps */}
              <iframe
                src="https://www.google.com/maps
                /embed?pb=!1m17!1m12!1m3!1d3807.934933189301!2d-72.538069!3d7
                .893084999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z
                N8KwNTMnMzUuMSJOIDcywrAzMicxNy4xIlc!5e1!3m2!1ses-419!
                2sco!4v1746322594023!5m2!1ses-419!2sco"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">Correo electrónico</h3>
              <p className="text-lg">nuevaesperanza@gmail.com</p>
            </div>
          </div>

          {/* Imagen */}
          <div className="flex-shrink-0">
            <img
              src="/img/map.png"
              alt="Mapa"
              className="w-64 sm:w-80 h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;