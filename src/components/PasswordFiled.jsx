import React, { useState } from "react";
import TextField from "./TextField";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({ onChange }) => {


    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="w-full relative">
            <TextField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Introduzca su contraseña aquí"
                onChange={onChange} />

            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500 focus:outline-none cursor-pointer"
                onClick={toggleShowPassword}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
};

export default PasswordField;
