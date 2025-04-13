import AdminLayout from "../../layouts/AdminLayout";

const UserLayout = ({ children, title }) => {
    return (
        <AdminLayout title={title}>
            {children}
        </AdminLayout>
    );
};

export default UserLayout;
