import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout";
import SupplierForm from "../../modules/admin/supplier/components/SupplierForm";
import "react-toastify/dist/ReactToastify.css";
import { updateSupplier } from "../../services/SupplierService";

export default function SupplierUpdate() {


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        const storedSupplier = localStorage.getItem("supplierData");
        if (storedSupplier) {
            setFormData(JSON.parse(storedSupplier)); 
        } else {
            toast.error("No se encontró el proveedor.", { position: "top-right", autoClose: 3000 });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            let cleanedValue = value.replace(/\D/g, "");
            if (cleanedValue.startsWith("57")) {
                cleanedValue = cleanedValue.slice(2);
            }
            const phoneNumber = cleanedValue.slice(0, 10);
            setFormData({ ...formData, [name]: `+57${phoneNumber}` });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.name.trim()) {
            errors.push("El nombre del proveedor es obligatorio.");
        }

        if (!formData.phone || formData.phone.length !== 13) {
            errors.push("El teléfono debe contener exactamente 10 dígitos después de +57.");
        }

        if (!formData.email.trim()) {
            errors.push("El correo electrónico es obligatorio.");
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push("El correo electrónico no es válido.");
        }

        if (errors.length > 0) {
            errors.forEach((err) => toast.error(err, { position: "top-right", autoClose: 3000 }));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await updateSupplier(formData.id, formData);
            toast.success("Proveedor actualizado exitosamente", { position: "top-right", autoClose: 3000 });

            setFormData({ id: "", name: "", phone: "", email: "" });
            localStorage.removeItem("supplierData"); // Limpiar localStorage después de actualizar
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 400:
                        if (data.errors) {
                            data.errors.forEach((err) => {
                                toast.error(err.message, { position: "top-right", autoClose: 3000 });
                            });
                        } else {
                            toast.error(`Error: ${data.message || "Datos inválidos."}`, { position: "top-right", autoClose: 3000 });
                        }
                        break;
                    case 409:
                        toast.error("Ya existe un proveedor con este correo o teléfono.", { position: "top-right", autoClose: 3000 });
                        break;
                    case 500:
                        toast.error("Error en el servidor, inténtelo más tarde.", { position: "top-right", autoClose: 3000 });
                        break;
                    default:
                        toast.error("Ocurrió un error inesperado.", { position: "top-right", autoClose: 3000 });
                }
            } else {
                toast.error("No se pudo conectar con el servidor.", { position: "top-right", autoClose: 3000 });
            }
        }
    };

    const handleCancel = () => {
        setFormData({ name: "", phone: "", email: "", status: "ACTIVE" });
    };

    return (
        <SupplierLayout title="Editar proveedor">
            <SupplierForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
            />
        </SupplierLayout>
    );
}