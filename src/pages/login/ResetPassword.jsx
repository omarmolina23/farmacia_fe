import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordField from "../../components/PasswordField";
import Button from "../../components/Button";
import AuthSidebar from "../../components/AuthSidebar";
import { setPassword as setPasswordService } from "../../services/UserService";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";

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

  const getPasswordStrength = (password) => {
    return password ? zxcvbn(password).score : -1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.password || !user.confirmPassword) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (getPasswordStrength(user.password) < 3) {
      toast.error("La contraseña es demasiado débil. Intente con otra más segura.");
      return;
    }

    try {
      await setPasswordService(token, user.password);
      toast.success("Contraseña cambiada exitosamente");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[#D0F25E] h-screen w-full flex flex-col lg:flex-row">
      <AuthSidebar />
      <div className="bg-white w-full lg:w-[60%] rounded-t-[40px] lg:rounded-l-[40px] overflow-hidden flex flex-col justify-center items-center py-8 px-4">
        <div className="p-6 flex flex-col w-full max-w-[400px] justify-evenly items-center">
          <h3 className="text-2xl md:text-xl mb-4 text-center">Restablecer contraseña</h3>
          <hr className="border-[#1e1e1e63] w-full" />

          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <label className="text-lg md:text-xl mt-4" htmlFor="password">Nueva contraseña</label>
            <PasswordField id="password" name="password" onChange={handleChange} />
            <div className="w-full h-1 mt-2 bg-gray-300 rounded">
              <div
                className="h-full rounded"
                style={{
                  width: user.password ? `${(getPasswordStrength(user.password) + 1) * 20}%` : "0%",
                  backgroundColor: user.password ? ["#ff4d4d", "#ff9933", "#ffcc00", "#66cc66", "#00b300"][getPasswordStrength(user.password)] : "transparent",
                  transition: "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
                }}
              ></div>
            </div>

            <label className="text-lg md:text-xl mt-4" htmlFor="confirmPassword">Confirme contraseña</label>
            <PasswordField id="confirmPassword" name="confirmPassword" onChange={handleChange} />

            <hr className="border-[#1e1e1e63] w-full mt-6 mb-6" />
            <Button color="bg-[#D0F25E]" type="submit" title="Aceptar" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
