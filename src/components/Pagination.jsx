import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

/**
 * Componente de paginación reutilizable.
 *
 * Props necesarias:
 * - currentPage: Número de la página actual.
 * - totalItems: Total de elementos a paginar.
 * - rowsPerPage: Cantidad de filas por página o "Todos" para mostrar todos los elementos.
 * - setCurrentPage: Función para actualizar la página actual.
 * - setRowsPerPage: Función para actualizar la cantidad de filas por página.
 * - rowsOptions: Opciones disponibles para filas por página.
 */

const Pagination = ({ currentPage, totalItems, rowsPerPage, setCurrentPage, setRowsPerPage, rowsOptions }) => {
    const totalPages = Math.ceil(totalItems / (rowsPerPage === "Todos" ? totalItems : rowsPerPage));
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleRowsPerPageChange = (e) => {
        const value = e.target.value;
        setRowsPerPage(value === "Todos" ? totalItems : parseInt(value));
        setCurrentPage(1);
    };

    return (
        
        <div className="flex justify-between items-center p-3 opacity-80">
            <div className="flex items-center">
                <span className="mr-2">Filas por página:</span>
                <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    {rowsOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <span>{(currentPage - 1) * (rowsPerPage === "Todos" ? totalItems : rowsPerPage) + 1}-{Math.min(currentPage * (rowsPerPage === "Todos" ? totalItems : rowsPerPage), totalItems)} de {totalItems}</span>
            <div className="flex items-center">
                <button disabled={currentPage === 1} onClick={handlePrevPage} className="p-2 disabled:opacity-50">
                    <FaArrowLeft />
                </button>
                <button disabled={currentPage === totalPages} onClick={handleNextPage} className="p-2 disabled:opacity-50">
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;