import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const isFieldDisabled = (isEditMode) => {
  return isEditMode? true : false;
};

const UserForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  isEditMode,
}) => {
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
          <label className="text-md font-medium w-70">Cédula</label>
          <TextField
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="bg-gray-200"
            disabled={isFieldDisabled(isEditMode)}
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">Nombre completo</label>
          <TextField
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-200"
            disabled={false}
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">
            Fecha de nacimiento
          </label>
          <TextField
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="bg-gray-200"
            disabled={false}
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
            disabled={isFieldDisabled(isEditMode)}
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">
            Confirme correo electrónico
          </label>
          <TextField
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="bg-gray-200"
            disabled={isFieldDisabled(isEditMode)}
          />
        </div>
        <div>
          <label className="text-md font-medium w-70">Teléfono</label>
          <TextField
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-200"
            disabled={false}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 p-4">
        <Button type="submit" title="Agregar" color="bg-[#8B83BA]" />
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

export default UserForm;
