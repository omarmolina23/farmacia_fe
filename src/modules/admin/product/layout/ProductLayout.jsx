import AdminLayout from "../../layouts/AdminLayout";

const ProductLayout = ({ children, title }) => {
    return (
        <AdminLayout title={title}>
            {children}
        </AdminLayout>
    );
};

export default ProductLayout;