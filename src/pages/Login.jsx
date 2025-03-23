const Login = () => {
    return (
        <div className="bg-[#D0F25E] h-[100vh] w-[100%] flex flex-row">
            <div className="w-[30%] flex-1 flex flex-col justify-center items-center">
                <div className="w-[60%] flex flex-col h-[20%] justify-center items-center mb-2">
                    <img className="h-auto w-[100%]" src="/img/textLogo.png" alt="Droguería La Nueva Esperanza" />
                </div>
                <div className="w-[60%] mt-6 flex flex-col justify-center items-center">
                    <img className="rounded-full h-auto w-[100%]" src="/img/logo.png" alt="Logo" />
                </div>

            </div>

            <div className="bg-white w-full lg:w-[60%] rounded-t-[40px] lg:rounded-l-[40px] overflow-hidden flex flex-col justify-center items-center py-8">
                <div className="p-6 flex flex-col w-[90%] max-w-[400px] justify-evenly items-center">
                    <div className="flex flex-col w-full justify-between items-center">
                        <h3 className="text-2xl md:text-3xl mb-4">Iniciar Sesión</h3>
                        <hr className="border-[#1e1e1e63] w-full" />
                    </div>

                    <form className="flex flex-col w-full justify-evenly items-center">
                        <label className="w-full text-lg md:text-xl text-left mt-4" htmlFor="email">Correo Electrónico</label>
                        <input
                            className="p-3 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="email"
                            id="email"
                            placeholder="Introduzca su correo aquí"
                        />

                        <label className="w-full text-lg text-left mt-4" htmlFor="password">Contraseña</label>
                        <input
                            className="p-3 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="password"
                            id="password"
                            placeholder="Introduzca su contraseña aquí"
                        />

                        <p className="w-full text-sm text-gray-500 cursor-pointer mt-4 text-left">
                            ¿Has olvidado tu contraseña?
                        </p>

                        <hr className="border-[#1e1e1e63] w-full mt-6 mb-6" />

                        <button type="submit" className="bg-[#D0F25E] py-2 px-10 rounded-lg text-lg hover:bg-[#97b33c] shadow">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;  