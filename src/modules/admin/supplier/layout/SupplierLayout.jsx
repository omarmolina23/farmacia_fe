import PageHeader from "../../../../components/PageHeader";

const SupplierLayout = ({ children }) => {
    return (
        <> 
            <PageHeader title="hola" />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </>

    );
};

export default SupplierLayout;