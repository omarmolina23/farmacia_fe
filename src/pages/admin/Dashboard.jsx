import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import PageHeader from "../../components/PageHeader";
import { SectionCards } from "../../modules/admin/components/section-cards";

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="flex flex-1 flex-col bg-white">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <PageHeader title="Panel de control" />
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
