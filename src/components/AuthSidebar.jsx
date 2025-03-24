import React from "react";

const AuthSidebar = ({ }) => {
    return (
        <div className="w-[30%] flex-1 flex flex-col justify-center items-center">
            <div className="w-[60%] flex flex-col h-[20%] justify-center items-center mb-2">
                <img
                    className="h-auto w-[100%]"
                    src="/img/textLogo.png"
                    alt="Droguería La Nueva Esperanza"
                />
            </div>
            <div className="w-[60%] mt-6 flex flex-col justify-center items-center">
                <img
                    className="rounded-full h-auto w-[100%]"
                    src="/img/logo.png"
                    alt="Logo"
                />
            </div>
        </div>
    );
};

export default AuthSidebar;
