import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordField from "../../components/PasswordField";
import Button from "../../components/Button";
import AuthSidebar from "../../components/AuthSidebar";
import { setPassword as setPasswordService } from "../../services/UserService";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!user.password || !user.confirmPassword) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    if(user.password !== user.confirmPassword) {
      toast.error("Las contraseña no coinciden");
      return;
    }

    console.log("token", token); 

    try{
      await setPasswordService(token, user.password);

      toast.success("Contraseña cambiada exitosamente");

      navigate("/", { replace: true });

    } catch (error) {
        console.log(error);
      toast.error(error.message);
    }

    console.log(user);
  };

  return (
    <div className="bg-[#D0F25E] h-[100vh] w-[100%] flex flex-row">
      <AuthSidebar />

      <div className="bg-white w-full lg:w-[60%] rounded-t-[40px] lg:rounded-l-[40px] overflow-hidden flex flex-col justify-center items-center py-8">
        <div className="p-6 flex flex-col w-[90%] max-w-[400px] justify-evenly items-center">
          <div className="flex flex-col w-full justify-between items-center">
            <h3 className="text-2xl md:text-1xl mb-4">
              Restablecer contraseña
            </h3>
            <hr className="border-[#1e1e1e63] w-full" />
          </div>

          <form
            className="flex flex-col w-full justify-evenly items-center"
            onSubmit={handleSubmit}
          >
            <label
              className="w-full text-lg md:text-xl text-left mt-4"
              htmlFor="password"
            >
              Nueva contraseña
            </label>

            <PasswordField
              id="password"
              name="password"
              onChange={handleChange}
            />

            <label
              className="w-full text-lg md:text-xl text-left mt-4"
              htmlFor="password"
            >
              Confirme contraseña
            </label>

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
            />

            <hr className="border-[#1e1e1e63] w-full mt-6 mb-6" />
            <Button color="bg-[#D0F25E]" type="submit" title="Aceptar" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
