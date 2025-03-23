import SupplierLayout from "../../modules/admin/supplier/layout/SupplierLayout";
import Button from "../../components/Button";
export default function SupplierRegister() {
    return (
        <SupplierLayout title="Proveedores"> 
            <div className="flex flex-row gap-4">
            <Button color="bg-[#8B83BA]" type="submit" title="Registrar" />
            <Button color="bg-[#8B83BA]" type="submit" title="Cancelar" />
            </div> 
        </SupplierLayout>
    );
}
