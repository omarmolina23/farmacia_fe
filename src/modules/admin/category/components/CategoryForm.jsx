import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const CategoryForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 p-5">
      <div className="flex items-center space-x-5">
        <label className="text-md font-medium w-70">
          Nombre de la categoría:
        </label>
        <TextField
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Escriba el nombre de la nueva categoría"
        />
      </div>
      <div className="flex space-x-4 mt-4">
        <Button type="submit" title="Guardar" textColor="text-[#000000]" color="bg-[#D0F25E]" />
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

export default CategoryForm;
