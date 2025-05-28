import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";

const isFieldDisabled = (isEditMode) => isEditMode;

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
          <label htmlFor="role" className="text-md font-medium w-70">Rol</label>
          <select
            id="role"
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
          <label htmlFor="documentType" className="text-md font-medium w-70">
            Tipo de documento
          </label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="border rounded-md p-2 bg-gray-200 w-full"
            disabled={isFieldDisabled(isEditMode)}
          >
            <option value="">Seleccione un tipo</option>
            <option value="CC">Cédula de ciudadanía (CC)</option>
            <option value="CE">Cédula de extranjería (CE)</option>
            <option value="NIT">(NIT) Número de Identificación Tributaria</option>
          </select>
        </div>
        <div>
          <label htmlFor="id" className="text-md font-medium w-70">Número de Documento</label>
          <TextField
            id="id"
            type="text"
            name="id"
            value={formData.id}
            placeholder="Ingrese su número de documento"
            onChange={handleChange}
            className="bg-gray-200"
            disabled={isFieldDisabled(isEditMode)}
          />
        </div>
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">Nombre completo</label>
          <TextField
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-200"
            placeholder="Ingrese su nombre completo"
          />
        </div>
        <div>
          <label htmlFor="birthdate" className="text-md font-medium w-70">
            Fecha de nacimiento
          </label>
          <TextField
            id="birthdate"
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            placeholder="Seleccione su fecha de nacimiento"
            className="bg-gray-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-md font-medium w-70">Correo electrónico</label>
          <TextField
            id="email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Ingrese su correo electrónico"
            onChange={handleChange}
            className="bg-gray-200"
            disabled={isFieldDisabled(isEditMode)}
          />
        </div>
        <div>
          <label htmlFor="confirmEmail" className="text-md font-medium w-70">
            Confirme correo electrónico
          </label>
          <TextField
            id="confirmEmail"
            type="email"
            placeholder="Confirme su correo electrónico"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="bg-gray-200"
            disabled={isFieldDisabled(isEditMode)}
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-md font-medium w-70">Teléfono</label>
          <TextField
            id="phone"
            type="text"
            name="phone"
            placeholder="Ingrese su número de teléfono"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
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

export default UserForm;