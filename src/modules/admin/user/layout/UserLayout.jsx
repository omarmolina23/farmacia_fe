import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../../../components/PageHeader";

const UserLayout = ({ children, title }) => {
    return (
        <AdminLayout> 
            <div className="flex flex-col w-full">
                <PageHeader title={title} />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserLayout;
