import AdminSideBar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <>
            <div className="flex flex-row h-screen overflow-hidden">
                <AdminSideBar/>
                <div className="flex-1 overflow-auto"> 
                    {children}
                </div>
            </div>
        </>

    );
};

export default AdminLayout;