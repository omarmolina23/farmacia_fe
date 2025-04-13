import AdminLayout from "../../layouts/AdminLayout";

const CategoryLayout = ({ children, title }) => {
  return (
    <AdminLayout title={title}>
        {children}
    </AdminLayout>
  );
};

export default CategoryLayout;
