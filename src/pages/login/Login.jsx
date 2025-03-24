import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/UserService";
import { toast } from "react-toastify";
import TextField from "../../components/TextField";
import PasswordField from "../../components/PasswordFiled";
import Button from "../../components/Button";
import AuthSidebar from "../../components/AuthSidebar";
import ModalResetPassword from "../../components/ModalResetPassword";

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [showResetModal, setShowResetModal] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.email || !user.password) {
            toast.error("Por favor, complete todos los campos");
            return;
        }

        try {
            const response = await loginService(user.email, user.password);
            login(response.token, {
                name: response.name,
                isAdmin: response.isAdmin,
                status: response.status,
            });
            toast.success("Inicio de sesión exitoso");
            navigate(response.isAdmin ? "/inicio" : "/employees-inicio");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="bg-[#D0F25E] h-[100vh] w-[100%] flex flex-row">
            <AuthSidebar />
            <div className="bg-white w-full lg:w-[60%] rounded-t-[40px] lg:rounded-l-[40px] overflow-hidden flex flex-col justify-center items-center py-8">
                <div className="p-6 flex flex-col w-[90%] max-w-[400px] justify-evenly items-center">
                    <div className="flex flex-col w-full justify-between items-center">
                        <h3 className="text-2xl md:text-3xl mb-4">Iniciar Sesión</h3>
                        <hr className="border-[#1e1e1e63] w-full" />
                    </div>
                    <form className="flex flex-col w-full justify-evenly items-center" onSubmit={handleSubmit}>
                        <label className="w-full text-lg md:text-xl text-left mt-4" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <TextField type="email" id="email" name="email" placeholder="Introduzca su correo aquí" onChange={handleChange} />
                        <label className="w-full text-lg md:text-xl text-left mt-4" htmlFor="password">
                            Contraseña
                        </label>
                        <PasswordField onChange={handleChange} />
                        <p className="w-full text-sm text-gray-500 cursor-pointer mt-4 text-left" onClick={() => setShowResetModal(true)}>
                            ¿Has olvidado tu contraseña?
                        </p>
                        <hr className="border-[#1e1e1e63] w-full mt-6 mb-6" />
                        <Button color="bg-[#D0F25E]" colorSecundary="bg-[#8B83BA]" type="submit" title="Iniciar Sesión" />
                    </form>
                </div>
            </div>
            {showResetModal && (
                <ModalResetPassword onClose={() => setShowResetModal(false)} />
            )}
        </div>
    );
};

export default Login;