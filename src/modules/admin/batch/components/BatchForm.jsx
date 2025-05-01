import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const BatchForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  isEditMode,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 p-5">
      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Número de lote:</label>
        <TextField
          type="text"
          id="batchNumber"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          placeholder="Escriba el número del lote"
        />
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Proveedor:</label>
        <TextField
          type="text"
          id="supplierId"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          placeholder="Escriba el ID del proveedor"
        />
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Producto:</label>
        <TextField
          type="text"
          id="productId"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          placeholder="Escriba el ID del producto"
        />
      </div>

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Fecha de vencimiento:</label>
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

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Valor total:</label>
        <TextField
          type="number"
          id="totalValue"
          name="totalValue"
          value={formData.totalValue}
          onChange={handleChange}
          placeholder="Escriba el valor total del lote"
        />
      </div>

      <div className="flex space-x-4 mt-4">
        <Button type="submit" title="Registrar" color="bg-[#8B83BA]" />
        <Button type="button" title="Cancelar" color="bg-[#8B83BA]" onClick={handleCancel} />
      </div>
    </form>
  );
};

export default BatchForm;
