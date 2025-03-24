import { useEffect, useState } from "react";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import SupplierTable from "../../modules/admin/supplier/components/SupplierTable.jsx";
import { getSupplierAll, searchSupplier } from "../../services/SupplierService";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const SuppliersList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const rowsOptions = [10, 15, 20, 25, 30, 50];
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        getSupplierAll()
            .then(data => {
                if (Array.isArray(data)) {
                    setSuppliers(data.filter(supplier => supplier.status === "ACTIVE"));
                } else {
                    console.error("La respuesta no es un array");
                }
            })
            .catch(error => {
                console.error("Error al obtener los proveedores:", error);
                toast.error("Error al obtener proveedores");
            });
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim() === "") {
            fetchSuppliers();
            return;
        }
        
        try {
            const results = await searchSupplier(query);
            setSuppliers(results);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            toast.error("Error en la búsqueda de proveedores");
        }
    };

    const handleSupplierRegister = () => {
        navigate('/supplier-register');
    };

    const totalPages = Math.ceil(suppliers.length / rowsPerPage);
    const paginatedSuppliers = suppliers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
        setRowsPerPage(value === 50 ? 50 : parseInt(value));
        setCurrentPage(1);
    };

    return (
        <SupplierLayout title="Proveedores">
            <div className="w-full bg-white p-3 flex justify-between items-center border-none">
                <SearchBar placeholder="Buscar un proveedor" value={searchQuery} onChange={handleSearch} />
                <Button title="Registrar proveedor" color="bg-[#8B83BA]" onClick={handleSupplierRegister} />
            </div>
            <div className="bg-[#D0F25E] p-5 h-6 w-full"></div>
            <table className="text-sm w-full">
                <thead className="p-5 bg-[#95A09D] text-left">
                    <tr className="h-9">
                        <th className="pl-5">Nº</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Correo electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSuppliers.map((supplier, index) => (
                        <SupplierTable
                            key={supplier.id}
                            id={supplier.id}
                            index={(currentPage - 1) * rowsPerPage + index}
                            name={supplier.name}
                            phone={supplier.phone}
                            email={supplier.email}
                            status={supplier.status}
                            refreshList={fetchSuppliers}
                        />
                    ))}
                </tbody>
            </table>
            <Pagination 
                currentPage={currentPage} 
                totalItems={suppliers.length} 
                rowsPerPage={rowsPerPage} 
                setCurrentPage={setCurrentPage} 
                setRowsPerPage={setRowsPerPage} 
                rowsOptions={rowsOptions}
            />
        </SupplierLayout>
    );
};

export default SuppliersList;