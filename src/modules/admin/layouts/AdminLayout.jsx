import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../../components/ui/sidebar";
import PageHeader from "../../../components/PageHeader";

const AdminLayout = ({ children, title }) => {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset className="bg-white">
                <div className="flex flex-col w-full">
                    <PageHeader title={title} />
                    <div className="flex-1 overflow-auto mt-13">{children}</div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminLayout;