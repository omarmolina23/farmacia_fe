import EmployeesSideBar from "../components/EmployeesSidebar"; 

const EmployeesLayout = ({ children }) => {
    return (
        <>
            <div className="flex flex-row h-screen overflow-hidden">
                <EmployeesSideBar/>
                <div className="flex-1 overflow-auto"> 
                    {children}
                </div>
            </div>
        </>

    );
};

export default EmployeesLayout;