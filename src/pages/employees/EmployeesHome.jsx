import EmployeesLayout from "../../modules/employees/layouts/EmployeesLayout";
export default function AdminHome() {
    return (
        <EmployeesLayout>
            <div className="flex flex-col h-full items-center justify-center">
                <h1 className="text-4xl font-bold">Home Vendedor</h1>
            </div>
        </EmployeesLayout>
    );
}