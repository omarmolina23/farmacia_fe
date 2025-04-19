import { useState } from "react";

const ModalInfoProduct = ({ name, category, onClose }) => {

    return (
        <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
    <h2 className="text-xl font-semibold mb-4">Información del producto</h2>

    <table className="text-sm w-full">
      <tbody>
        <tr>
          <td className="font-semibold pr-2">Nombre:</td>
          <td>{name}</td>
        </tr>
        <tr>
          <td className="font-semibold pr-2">Categoría:</td>
          <td>{category}</td>
        </tr>
        <tr>
          <td className="font-semibold pr-2">Lote:</td>
          <td>{name}</td>
        </tr>
        <tr>
          <td className="font-semibold pr-2">Vencimiento:</td>
          <td>{name}</td>
        </tr>
      </tbody>
    </table>

    <button
      onClick={onClose}
      className="mt-6 bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
    >
      Cerrar
    </button>

    <button
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
    >
      ✕
    </button>
  </div>
</div>

    )

}

export default ModalInfoProduct;

