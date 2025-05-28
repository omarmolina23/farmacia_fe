import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const BatchForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
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

      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Valor compra:</label>
        <TextField
          type="number"
          id="purchaseValue"
          name="purchaseValue"
          value={formData.purchaseValue}
          onChange={handleChange}
          placeholder="Escriba el coste total del lote"
        />
      </div>

      <div className="flex space-x-4 mt-4">
        <Button type="submit" title="Registrar" textColor="text-[#000000]" color="bg-[#D0F25E]" />
        <Button
          type="button"
          textColor="text-[#000000]"
          title="Cancelar"
          color="bg-[#D0F25E]"
          onClick={handleCancel}
        />
      </div>
    </form>
  );
};

export default BatchForm;
