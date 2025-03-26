import { useEffect, useState } from "react";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import SupplierTable from "../../modules/admin/supplier/components/SupplierTable.jsx";
import { getSupplierAll, searchSupplier } from "../../services/SupplierService";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import FilterStatus from "../../components/FilterStatus";

const SuppliersList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [hoverColumn, setHoverColumn] = useState(null);
    const [filterStatus, setFilterStatus] = useState("ACTIVE");

    const rowsOptions = [10, 15, 20, 25, 30, 50];
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuppliers();
    }, [filterStatus]);

    const fetchSuppliers = () => {
        getSupplierAll()
            .then(data => {
                if (Array.isArray(data)) {
                    setSuppliers(data.filter(supplier => supplier.status === filterStatus));
                } else {
                }
            })
            .catch(error => {
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
            toast.error("Error en la búsqueda de proveedores");
        }
    };

    const handleSupplierRegister = () => {
        navigate('/admin/supplier/register');
    };

    const sortedSuppliers = [...suppliers].sort((a, b) => {
        if (sortConfig.key) {
            const valueA = a[sortConfig.key].toLowerCase();
            const valueB = b[sortConfig.key].toLowerCase();
            if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        }
        return 0;
    });

    const paginatedSuppliers = sortedSuppliers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <SupplierLayout title="Proveedores">
            <div className="w-full bg-white p-3 flex flex-col md:flex-row justify-between items-center gap-3 border-none">
                <SearchBar
                    placeholder="Buscar un proveedor"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full md:w-auto"
                />
                <Button
                    title="Registrar proveedor"
                    color="bg-[#8B83BA]"
                    onClick={handleSupplierRegister}
                    className="w-full md:w-auto"
                />
            </div>

            <FilterStatus filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

            <div className="w-full overflow-x-auto">
                <table className="text-sm w-full min-w-[600px]">
                    <thead className="p-5 bg-[#95A09D] text-left">
                        <tr className="h-9">
                            <th className="pl-5">Nº</th>
                            <th
                                onMouseEnter={() => setHoverColumn("name")}
                                onMouseLeave={() => setHoverColumn(null)}
                                onClick={() => handleSort("name")}
                                className="cursor-pointer flex items-center gap-2 p-2"
                            >
                                Nombre
                                {(hoverColumn === "name" || sortConfig.key === "name") && (
                                    sortConfig.key === "name" && sortConfig.direction === "asc"
                                        ? <IoIosArrowUp />
                                        : <IoIosArrowDown />
                                )}
                            </th>
                            <th className="hidden md:table-cell">Teléfono</th>
                            <th
                                onMouseEnter={() => setHoverColumn("email")}
                                onMouseLeave={() => setHoverColumn(null)}
                                onClick={() => handleSort("email")}
                                className="cursor-pointer flex items-center gap-2 hidden md:table-cell"
                            >
                                Correo electrónico
                                {(hoverColumn === "email" || sortConfig.key === "email") && (
                                    sortConfig.key === "email" && sortConfig.direction === "asc"
                                        ? <IoIosArrowUp />
                                        : <IoIosArrowDown />
                                )}
                            </th>
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
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={sortedSuppliers.length}
                rowsPerPage={rowsPerPage}
                setCurrentPage={setCurrentPage}
                setRowsPerPage={setRowsPerPage}
                rowsOptions={rowsOptions}
            />
        </SupplierLayout>
    );
};

export default SuppliersList;
