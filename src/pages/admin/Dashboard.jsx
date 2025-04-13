import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import PageHeader from "../../components/PageHeader";
import { SectionCards } from "../../modules/admin/components/section-cards";
import { RadialChart } from "../../modules/admin/components/radial-charts";
import { RadarChartStock } from "../../modules/admin/components/radar-charts";
import { AreaChartSales } from "../../modules/admin/components/area-charts";
import RecentSalesCard from "../../modules/admin/components/recent-sales-card";

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="flex flex-1 flex-col bg-white">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <PageHeader title="Panel de control" />
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mt-10">
                        <SectionCards />
                        <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:px-6 @xl/main:grid-cols-6 items-center">
                            <div className="@xl/main:col-span-3 w-full">
                                <RadialChart />
                            </div>
                            <div className="@xl/main:col-span-3 w-full">
                                <RadarChartStock />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:px-6 @xl/main:grid-cols-10 items-stretch">
                            <div className="@xl/main:col-span-7 w-full">
                                <AreaChartSales />
                            </div>
                            <div className="@xl/main:col-span-3 w-full">
                                <RecentSalesCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
