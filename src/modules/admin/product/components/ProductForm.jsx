import React, { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";
import UploadImage from "../../../../components/UploadImage";
import Select from "react-select";
import { getCategoryAll as getCategoriesService } from "../../../../services/CategoryService";
import { getTagAll as getTagsService } from "../../../../services/TagService";
import { toast } from "react-toastify";

const isFieldDisable = (isEditMode) => isEditMode;

const ProductForm = ({
  formData,
  handleChange,
  handleChangeImage,
  handleChangeTags,
  handleSubmit,
  handleCancel,
  isEditMode,
}) => {
  const [categories, setCategories] = useState([]);

  const [tags, setTags] = useState([]);
  const [optionsTags, setOptionsTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesService();
        setCategories(response);
      } catch (error) {
        toast.error("Error cargando las categorías", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTagsService();
        setTags(response);
        setOptionsTags(
          response.map((tag) => ({
            value: tag.id,
            label: tag.name,
          }))
        );
      } catch (error) {
        toast.error("Error cargando las etiquetas", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchTags();
  }, []);

  function base64ToFile(base64, filename) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const handleConversionImage = (imageList) => {
    const urls = imageList.map((image) => image.data_url);
    const files = urls.map((url, index) =>
      base64ToFile(url, `image-${index}.jpg`)
    );
    setImages(files);
    handleChangeImage(files);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-4 p-4">
      <div className="grid grid-cols-1 gap-6 p-4">
        <div>
          <label htmlFor="name" className="text-md font-medium w-70">
            Nombre
          </label>
          <TextField
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="text-md font-medium w-70 h-40"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="categoryId" className="text-md font-medium w-70 h-40">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-md p-3 bg-gray-200 w-full"
          >
            <option value="">Seleccione una categoría</option>
            {categories
              .filter((category) => category.status === "ACTIVE")
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="text-md font-medium w-70">
            Precio
          </label>
          <TextField
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 px-4">
        <div>
          <label htmlFor="concetration" className="text-md font-medium w-70">
            Concentración
          </label>
          <TextField
            id="concentration"
            type="text"
            name="concentration"
            value={formData.concentration}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
        <div>
          <label
            htmlFor="activeIngredient"
            className="text-md font-medium w-70"
          >
            Ingrediente activo
          </label>
          <TextField
            id="activeIngredient"
            type="text"
            name="activeIngredient"
            value={formData.activeIngredient}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
        <div>
          <label htmlFor="weight" className="text-md font-medium w-70">
            Peso
          </label>
          <TextField
            id="weight"
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
        <div>
          <label htmlFor="volume" className="text-md font-medium w-70">
            Volumen
          </label>
          <TextField
            id="volume"
            type="text"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            className="bg-gray-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 px-4 ">
        <div>
          <label htmlFor="tags" className="text-md font-medium w-70">
            Etiquetas
          </label>
          <Select
            id="tags"
            name="tags"
            placeholder="Seleccione etiquetas"
            className="bg-gray-200 text-md "
            options={optionsTags}
            isMulti
            onChange={handleChangeTags}
          ></Select>
        </div>
        <div>
          <label htmlFor="images" className="text-md font-medium w-70">
            Imágenes (máximo 3 imágenes de 5MB cada una) 
          </label>
          <UploadImage
            images={images}
            setImages={setImages}
            handleChange={handleConversionImage}
            setLocalImages={setImages}
            maxNumber={3}
          />
        </div>
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

export default ProductForm;
