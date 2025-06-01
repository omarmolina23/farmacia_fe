import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import { ForecastByCategory } from "../../modules/admin/forecasting/components/category-forecast";
import { ForecastByProduct } from "../../modules/admin/forecasting/components/product-forecast";
import AiAssistant from "../../modules/admin/forecasting/components/ai-assistant";

export default function Forecasting() {

    return (
        <AdminLayout title="Predicción">
            <div className="flex flex-col flex-1 bg-white">
                <div className="@container/main flex flex-col flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Sección 1 */}
                    <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-10 items-start">
                        <div className="@xl/main:col-span-10 w-full">
                            <ForecastByCategory />
                        </div>
                    </div>

                    {/* Sección 2 */}
                    <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-10 items-start">
                        <div className="@xl/main:col-span-10 w-full">
                            <ForecastByProduct />
                        </div>
                    </div>

                    {/* Porcentaje estándar de aceptación de la predicción */}
                    <div className="@xl/main:col-span-10 w-ful">
                        <div className="flex items-center gap-2 bg-[#f0f0f0e7] text-gray-800  border-l-4 border-green-500 p-4 rounded-md shadow-sm ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-800">
                                Porcentaje estándar de aceptación de la predicción:
                                <span className="ml-1 text-green-600">85%</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <AiAssistant />
        </AdminLayout>

    );
};

