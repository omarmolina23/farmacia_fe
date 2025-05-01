import React from "react";
import ClientHeader from "../components/ClientHeader";

const ClientLayout = ({ children, title }) => {
    return (
        <div className="flex flex-col w-full">
            <ClientHeader title={title} />
            <div className="flex-1 overflow-auto mt-13">{children}</div>
        </div>
    );
}

export default ClientLayout;