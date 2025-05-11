import React from 'react';
import ClientLayout from '../../modules/clients/layouts/ClientLayout';
import AboutUsSection from '../../modules/clients/components/AboutUsSection';
import ServicesSection from '../../modules/clients/components/ServicesSection';
import ContactSection from '../../modules/clients/components/ContactSection';

const ClientsAboutUs = () => {
    return (
        <ClientLayout title="About Us">
        <AboutUsSection />
        <ServicesSection />
        <ContactSection />
        </ClientLayout>
    );
};

export default ClientsAboutUs;

