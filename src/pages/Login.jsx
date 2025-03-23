import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/UserService";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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

      console.log("response", response);
      login(response.token, {
        name: response.name,
        isAdmin: response.isAdmin,
        status: response.status
      });

      toast.success("Inicio de sesión exitoso");

      if (response.isAdmin) {
        navigate("/inicio");
      } else {
        navigate("/employees-inicio");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="bg-[#D0F25E] h-[100vh] w-[100%] flex flex-row">
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

      <div className="bg-white w-full lg:w-[60%] rounded-t-[40px] lg:rounded-l-[40px] overflow-hidden flex flex-col justify-center items-center py-8">
        <div className="p-6 flex flex-col w-[90%] max-w-[400px] justify-evenly items-center">
          <div className="flex flex-col w-full justify-between items-center">
            <h3 className="text-2xl md:text-3xl mb-4">Iniciar Sesión</h3>
            <hr className="border-[#1e1e1e63] w-full" />
          </div>

          <form
            className="flex flex-col w-full justify-evenly items-center"
            onSubmit={handleSubmit}
          >
            <label
              className="w-full text-lg md:text-xl text-left mt-4"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <input
              className="p-3 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              type="email"
              id="email"
              name="email"
              placeholder="Introduzca su correo aquí"
              onChange={handleChange}
            />

            <label className="w-full text-lg md:text-xl text-left mt-4" htmlFor="password">
              Contraseña
            </label>

            <div className="w-full relative">
              <input
                className="p-3 pr-12 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Introduzca su contraseña aquí"
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500 focus:outline-none cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="w-full text-sm text-gray-500 cursor-pointer mt-4 text-left">
              ¿Has olvidado tu contraseña?
            </p>

            <hr className="border-[#1e1e1e63] w-full mt-6 mb-6" />

            <button
              type="submit"
              className="bg-[#D0F25E] py-2 px-10 rounded-lg text-lg hover:bg-[#97b33c] shadow cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
