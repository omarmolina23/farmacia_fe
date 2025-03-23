import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout";

export default function SupplierRegister() {
    return (
        <AdminLayout>
            <SupplierLayout> 
            <div className="flex flex-col h-full items-center justify-center">
                <h1 className="text-4xl font-bold">Home Administrador</h1>
            </div>
        </SupplierLayout>
        </AdminLayout>
        
    );
}