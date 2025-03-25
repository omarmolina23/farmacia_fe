import React from "react";
import Button from "./Button";

/**
 * Props:
 * - filterStatus (string): Estado actual del filtro. Puede ser "ACTIVE" o "INACTIVE".
 * - setFilterStatus (function): Función para actualizar el estado del filtro.
 * 
 * Uso:
 * ```
 * const [filterStatus, setFilterStatus] = useState("ACTIVE");
 * 
 * <FilterStatus 
 *    filterStatus={filterStatus} 
 *    setFilterStatus={setFilterStatus} 
 * />
 * ```
 */

const FilterStatus = ({ filterStatus, setFilterStatus }) => {
    return (
        <div className="bg-[#D0F25E] p-5 flex gap-4 flex-wrap justify-start">
            <Button
                title="Habilitados"
                textColor={filterStatus === "ACTIVE" ? "text-white" : "text-gray-900"}
                onClick={() => setFilterStatus("ACTIVE")}
                color={filterStatus === "ACTIVE" ? "bg-green-500" : "bg-gray-300"}
            />
            <Button
                title="Deshabilitados"
                textColor={filterStatus === "INACTIVE" ? "text-white" : "text-gray-900"}
                onClick={() => setFilterStatus("INACTIVE")}
                color={filterStatus === "INACTIVE" ? "bg-red-500" : "bg-gray-300"}
            />
        </div>
    );
};

export default FilterStatus;