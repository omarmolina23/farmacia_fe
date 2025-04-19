import React from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";
import ImageCarousel from "../../../../components/ImageCarousel";
import ProductTags from "../../../../components/ProductTag";

const ProductInfo = ({ elementData, handleCancel }) => {
  return (
    <div className="w-full max-w-5xlxl space-y-4 p-4">
      {elementData.images && elementData.images.length > 0 ? (
        <ImageCarousel images={elementData.images} />
      ) : null}
      <div className="grid grid-cols-1 gap-6 px-4 mt-4 mb-6">
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Nombre
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.name || "N/A"}
            disabled={true}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-md font-medium w-70 h-40"
          >
            Descripción
          </label>
          <div className="w-full h-32 p-2 border border-gray-300 rounded overflow-y-auto whitespace-pre-wrap bg-gray-50">
            {elementData.description || "Sin descripción"}
          </div>
          {elementData.tags && elementData.tags.length > 0 ? (
            <ProductTags tags={elementData.tags.map((tag) => tag.tag.name)} />
          ) : null}
        </div>
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Categoría
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.category || "Sin categoría"}
            disabled={true}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 px-4 mb-6">
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Precio
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.price || "Sin precio"}
            disabled={true}
          />
        </div>
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Estado
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.status === "ACTIVE" ? "Activo" : "Inactivo"}
            disabled={true}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 px-4 mb-6">
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Concentración
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.concentration || "N/A"}
            disabled={true}
          />
        </div>
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Ingrediente activo
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.activeIngredient || "N/A"}
            disabled={true}
          />
        </div>
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Peso
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.weight || "N/A"}
            disabled={true}
          />
        </div>
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Volumen
          </label>
          <TextField
            type="text"
            id="name"
            name="name"
            value={elementData.volume || "N/A"}
            disabled={true}
          />
        </div>

        <div className="flex space-x-4 mt-4">
          <Button
            type="button"
            title="Regresar"
            color="bg-[#8B83BA]"
            onClick={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
