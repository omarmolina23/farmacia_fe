import { FiEdit, FiBan } from "react-icons/fi"

const SupplierTable = ({ }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#c9e265]">
            <th className="py-3 px-4 text-left font-medium text-black border-b border-gray-300">N° del proveedor</th>
            <th className="py-3 px-4 text-left font-medium text-black border-b border-gray-300">Nombre</th>
            <th className="py-3 px-4 text-left font-medium text-black border-b border-gray-300">Teléfono</th>
            <th className="py-3 px-4 text-left font-medium text-black border-b border-gray-300">Correo electrónico</th>
            <th className="py-3 px-4 text-left font-medium text-black border-b border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers && suppliers.length > 0 ? (
            suppliers.map((supplier, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-black">hola</td> 
                <td className="py-3 px-4 text-black">hola</td>
                <td className="py-3 px-4 text-black">hola</td>
                <td className="py-3 px-4 text-black">hola</td>
                <td className="py-3 px-4 flex space-x-4">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center">
                    Editar <FiEdit className="ml-1 h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 flex items-center">
                    Deshabilitar <FiBan className="ml-1 h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                No hay proveedores disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SupplierTable