import Button from "./Button";

const FilterRepaid = ({ filterStatus, setFilterStatus }) => {
    return (
        <div className="bg-[#D0F25E] p-3 flex gap-4 flex-wrap justify-start w-full">
            <Button
                title="Facturas"
                textColor={!filterStatus ? "text-white" : "text-gray-900"}
                onClick={() => setFilterStatus(false)}
                color={!filterStatus ? "bg-green-500" : "bg-gray-300"}
            />
            <Button
                title="Devoluciones"
                textColor={filterStatus ? "text-white" : "text-gray-900"}
                onClick={() => setFilterStatus(true)}
                color={filterStatus ? "bg-red-500" : "bg-gray-300"}
            />
        </div>
    );
};

export default FilterRepaid;