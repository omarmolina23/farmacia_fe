import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const BatchForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  suppliers = [],
  product,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 p-5">
      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Número de lote:</label>
        <TextField
          type="text"
          id="number_batch"
          name="number_batch"
          value={formData.batchNumber}
          onChange={handleChange}
          placeholder="Escriba el número del lote"
        />
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Producto:</label>
        <TextField
          type="text"
          id="productId"
          name="productId"
          value={product}
          onChange={handleChange}
          placeholder="Escriba el ID del producto"
          disabled={true}
        />
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Proveedor:</label>
        <select
          id="supplierId"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          className="bg-gray-200 p-2 rounded-md w-full"
        >
          <option value="">Seleccione un proveedor</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">
          Fecha de vencimiento:
        </label>
        <input
          type="date"
          id="expirationDate"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          className="bg-gray-200 p-2 rounded-md w-full"
        />
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Cantidad:</label>
        <TextField
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Escriba la cantidad del lote"
        />
      </div>

      <div className="flex space-x-4 mt-4">
        <Button type="submit" title="Registrar" color="bg-[#8B83BA]" />
        <Button
          type="button"
          title="Cancelar"
          color="bg-[#8B83BA]"
          onClick={handleCancel}
        />
      </div>
    </form>
  );
};

export default BatchForm;
