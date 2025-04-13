import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../../components/ui/sidebar";

const AdminLayout = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset className="bg-white">
            {children}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminLayout;