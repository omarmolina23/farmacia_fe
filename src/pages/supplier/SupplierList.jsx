import { useEffect, useState } from "react";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout.jsx";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import SupplierTable from "../../modules/admin/supplier/components/SupplierTable.jsx";
import { getSupplierAll, searchSupplier } from "../../services/SupplierService";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const SuppliersList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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
                    {suppliers.map((supplier, index) => (
                        <SupplierTable
                            key={index}
                            id={supplier.id}
                            index={index}
                            name={supplier.name}
                            phone={supplier.phone}
                            email={supplier.email}
                            status={supplier.status}
                            refreshList={fetchSuppliers}
                        />
                    ))}
                </tbody>
            </table>
        </SupplierLayout>
    );
}

export default SuppliersList;