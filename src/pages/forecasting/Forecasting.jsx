import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import ForecastLineChart  from "../../modules/admin/forecasting/TradingViewChart"

export default function Forecasting () {

    return (
        <AdminLayout title="Predicción">
            <ForecastLineChart/>
        </AdminLayout>
    );
};

