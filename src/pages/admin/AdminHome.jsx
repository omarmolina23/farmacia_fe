import AdminLayout from "../../modules/admin/layouts/AdminLayout";

export default function AdminHome() {
    return (
        <AdminLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <h1 className="text-4xl font-bold">Home Administrador</h1>
            </div>
        </AdminLayout>
    );
}