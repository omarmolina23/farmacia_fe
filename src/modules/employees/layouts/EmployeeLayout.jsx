import { AppSidebarEmployee } from "../components/app-sidebar-employee";
import { SidebarProvider, SidebarInset } from "../../../components/ui/sidebar";
import PageHeader from "../../../components/PageHeader";
import { motion } from "framer-motion";

const EmployeesLayout = ({ children, title }) => {

    const pageVariants = {
        initial: { opacity: 0, y: 5 },
        animate: { opacity: 2, y: 0 },
        exit: { opacity: 0, y: -16 },
    };

    const pageTransition = {
        duration: 0.3,
        ease: "easeInOut",
    };
    return (
        <SidebarProvider>
            <AppSidebarEmployee variant="inset" />
            <SidebarInset className="bg-white">
                <div className="flex flex-col w-full">
                    <PageHeader title={title} />
                    <motion.div
                        className="flex-1 overflow-auto"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        {children}
                    </motion.div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default EmployeesLayout;