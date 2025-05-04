import React from 'react';
import ClientHeader from '../../modules/clients/components/ClientHeader';
import ClientLayout from '../../modules/clients/layouts/ClientLayout';
import AboutUsSection from '../../modules/clients/components/AboutUsSection';
import ServicesSection from '../../modules/clients/components/ServicesSection';

const ClientsAboutUs = () => {
    return (
        <ClientLayout title="About Us">
        <AboutUsSection />
        <ServicesSection />
        </ClientLayout>
    );
};

export default ClientsAboutUs;