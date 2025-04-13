import AdminLayout from "../../layouts/AdminLayout";

const SupplierLayout = ({ children, title }) => {
    return (
        <AdminLayout title={title}>
            {children}
        </AdminLayout>
    );
};

export default SupplierLayout;
