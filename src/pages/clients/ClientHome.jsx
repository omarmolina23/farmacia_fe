import React from "react";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import CategorySection from "../../modules/clients/components/CategorySection";
import MainSection from "../../modules/clients/components/MainSection";

const fontStyle = {
  fontFamily: "'Nanum Pen Script', cursive",
};

const ClientHome = () => {
  return (
    <ClientLayout title="Client Home">
      <MainSection />
      <CategorySection />
    </ClientLayout>
  );
};

export default ClientHome;
