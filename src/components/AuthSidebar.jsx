import React from "react";

const AuthSidebar = () => {
    return (
        <div className="w-full md:w-[30%] flex-1 flex flex-col justify-center items-center p-4">
            <div className="w-full md:w-[60%] max-w-xs sm:max-w-sm flex flex-col h-auto justify-center items-center">
                <img
                    className="w-[70%] sm:w-[60%] md:w-full h-auto transition-all duration-300"
                    src="/img/textLogo.png"
                    alt="Droguería La Nueva Esperanza"
                />
            </div>

            <div className="w-full md:w-[60%] max-w-xs sm:max-w-sm flex flex-col justify-center items-center mt-4 md:mt-6">
                <img
                    className="rounded-full w-[50%] sm:w-[40%] md:w-full h-auto transition-all duration-300"
                    src="/img/logo.png"
                    alt="Logo"
                />
            </div>
        </div>
    );
};

export default AuthSidebar;