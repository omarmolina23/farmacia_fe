import React from 'react';
import ClientHeader from '../../modules/clients/components/ClientHeader';
import ClientLayout from '../../modules/clients/layouts/ClientLayout';
import AboutUsSection from '../../modules/clients/components/AboutUsSection';

const ClientsAboutUs = () => {
    return (
        <ClientLayout title="About Us">
        <AboutUsSection />
        </ClientLayout>
    );
};

export default ClientsAboutUs;