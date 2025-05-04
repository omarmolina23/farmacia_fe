import AdminLayout from "../../layouts/AdminLayout";

const BatchLayout = ({ children, title }) => {
    return (
        <AdminLayout title={title}>
            {children}
        </AdminLayout>
    );
};

export default BatchLayout;
