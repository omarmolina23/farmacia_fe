import React from "react";
import ClientHeader from "../components/ClientHeader";
import Footer from "../components/Footer";

const ClientLayout = ({ children, title }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <ClientHeader title={title} />

      <main className="flex-1 overflow-auto px-4 sm:px-6 md:px-8 py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
