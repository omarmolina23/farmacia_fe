import React from "react";
import ClientHeader from "../components/ClientHeader";
import Footer from "../components/Footer";

const ClientLayout = ({ children, title }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <ClientHeader title={title} />

      {/* Ajuste: Elimina el padding horizontal */}
      <main className="flex-1 overflow-auto pt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;