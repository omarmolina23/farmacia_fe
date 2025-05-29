import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import {ForecastByCategory}  from "../../modules/admin/forecasting/TradingViewChart";

export default function Forecasting () {

    return (
        <AdminLayout title="Predicción">
            <ForecastByCategory/>
        </AdminLayout>
    );
};

