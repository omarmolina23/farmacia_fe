import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const SupplierForm = ({ formData, handleChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 p-5">
      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Nombre del proveedor:</label>
        <TextField
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Escriba el nombre del nuevo proveedor"
        />
      </div>
      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Teléfono:</label>
        <TextField
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Escriba el teléfono del nuevo proveedor"
        />
      </div>
      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">Correo electrónico:</label>
        <TextField
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Escriba el correo del nuevo proveedor"
        />
      </div>
      <div className="flex space-x-4 mt-4">
        <Button type="submit" title="Registrar" color="bg-[#D0F25E]" textColor="text-[#000000]" />
        <Button type="button" title="Cancelar" color="bg-[#D0F25E]" textColor="text-[#000000]" onClick={handleCancel} />
      </div>
    </form>
  );
};

export default SupplierForm;
