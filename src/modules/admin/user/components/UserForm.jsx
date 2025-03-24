import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const UserForm = ({ formData, handleChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-4 p-4">
      <div className="grid grid-cols-2 gap-6 p-4">
        <div>
          <label className="text-md font-medium w-70">Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded-md p-2 bg-gray-200 w-full"
          >
            <option value="">Seleccione un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Vendedor">Vendedor</option>
          </select>
        </div>
        <div>
          <label className="text-md font-medium w-70">Teléfono</label>
          <TextField
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-200"
            disabled
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">Nombre completo</label>
          <TextField
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-gray-200"
            disabled
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">Edad</label>
          <TextField
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="bg-gray-200"
            disabled
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">Correo electrónico</label>
          <TextField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-200"
            disabled
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">Confirme correo electrónico</label>
          <TextField
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="bg-gray-200"
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 p-4">
        <Button type="submit" title="Agregar" color="bg-[#8B83BA]" />
        <Button type="button" title="Cancelar" color="bg-[#8B83BA]" onClick={handleCancel} />
      </div>
    </form>
  );
};

export default UserForm;