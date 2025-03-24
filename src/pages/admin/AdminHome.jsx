import AdminLayout from "../../modules/admin/layouts/AdminLayout";
import PageHeader from "../../components/PageHeader";

export default function AdminHome() {
    return (
        <AdminLayout>
            <PageHeader title="Categorias" />
            <div className="w-full p-4 flex justify-between items-center">
            </div>
        </AdminLayout>
    );
}
