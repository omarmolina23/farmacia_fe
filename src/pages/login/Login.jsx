import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/UserService";
import { toast } from "react-hot-toast";
import TextField from "../../components/TextField";
import PasswordField from "../../components/PasswordField";
import Button from "../../components/Button";
import AuthSidebar from "../../components/AuthSidebar";
import ModalResetPassword from "./ModalResetPassword";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showResetModal, setShowResetModal] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin/dashboard" : "/employees/dashboard");
    }
  }, [user]);

  const handleChange = ({ target: { name, value } }) => {
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    try {
      const response = await loginService(userData.email, userData.password);

      login({
        name: response.name,
        isAdmin: response.isAdmin,
        status: response.status,
      });
      toast.success("Inicio de sesión exitoso");
      navigate(response.isAdmin ? "/admin/dashboard" : "/employees/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[#D0F25E] min-h-screen flex flex-col lg:flex-row items-center lg:items-stretch">
      <AuthSidebar className="w-full md:w-[25%] sm:w-[35%]" />
      <div className="bg-white w-full lg:w-3/5 rounded-t-3xl lg:rounded-l-3xl flex flex-col justify-center items-center py-8 px-6">
        <div className="w-full max-w-md flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">Iniciar Sesión</h3>
          <hr className="border-gray-300 w-full" />
          <form className="w-full flex flex-col mt-6" onSubmit={handleSubmit}>
            <label className="text-lg md:text-xl mb-1" htmlFor="email">Correo Electrónico</label>
            <TextField
              type="email"
              id="email"
              name="email"
              placeholder="Introduzca su correo aquí"
              onChange={handleChange}
            />
            <label className="text-lg md:text-xl mt-4 mb-1" htmlFor="password">Contraseña</label>
            <PasswordField onChange={handleChange} />
            <p className="text-sm text-gray-500 cursor-pointer mt-3 text-left" onClick={() => setShowResetModal(true)}>
              ¿Has olvidado tu contraseña?
            </p>
            <hr className="border-gray-300 w-full my-6" />
            <Button color="bg-[#D0F25E]" textColor="text-black" type="submit" title="Iniciar Sesión" />
          </form>
        </div>
      </div>
      {showResetModal && <ModalResetPassword onClose={() => setShowResetModal(false)} />}
    </div>
  );
};

export default Login;