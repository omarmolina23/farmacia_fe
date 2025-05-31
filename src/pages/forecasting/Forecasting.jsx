import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import { ForecastByCategory } from "../../modules/admin/forecasting/components/category-forecast";
import { ForecastByProduct } from "../../modules/admin/forecasting/components/product-forecast";
import AiAssistant from "../../modules/admin/forecasting/components/AiAssistant";

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
                    {/*           para el futuro, decir el procentaje de aceptacion de la predeccion <div> 
                        <p className="text-sm text-gray-500">
                            Esta sección te permite predecir las ventas por categoría o producto, ayudándote a tomar decisiones informadas basadas en datos históricos.
                        </p>
                    </div> */}
                </div>
            </div>
            <AiAssistant />
        </AdminLayout>

    );
};

