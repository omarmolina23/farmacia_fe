import PasswordField from "../../components/PasswordFiled";
import Button from "../../components/Button";
import AuthSidebar from "../../components/AuthSidebar";

const ResetPassword = () => {

    const handleChange = ({ target: { name, value } }) => {
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="bg-[#D0F25E] h-[100vh] w-[100%] flex flex-row">
            
            <AuthSidebar />

            <div className="bg-white w-full lg:w-[60%] rounded-t-[40px] lg:rounded-l-[40px] overflow-hidden flex flex-col justify-center items-center py-8">
                <div className="p-6 flex flex-col w-[90%] max-w-[400px] justify-evenly items-center">
                    <div className="flex flex-col w-full justify-between items-center">
                        <h3 className="text-2xl md:text-1xl mb-4">Restablecer contraseña</h3>
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

                        <PasswordField onChange={handleChange} />

                        <label
                            className="w-full text-lg md:text-xl text-left mt-4"
                            htmlFor="password"
                        >
                            Confirme contraseña
                        </label>

                        <PasswordField onChange={handleChange} />

                        <hr className="border-[#1e1e1e63] w-full mt-6 mb-6" />
                        <Button color="bg-[#D0F25E]" type="submit" title="Aceptar" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
