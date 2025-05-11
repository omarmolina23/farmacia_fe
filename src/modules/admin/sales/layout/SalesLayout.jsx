import AdminLayout from "../../layouts/AdminLayout";

const SalesLayout = ({ children, title }) => {
    return (
        <AdminLayout title={title}>
            {children}
        </AdminLayout>
    );
};

export default SalesLayout;