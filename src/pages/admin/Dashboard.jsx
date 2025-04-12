import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="flex flex-1 flex-col bg-white">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <PageHeader title="Panel de control" />
                </div>
            </div>
        </AdminLayout>
    );
}
