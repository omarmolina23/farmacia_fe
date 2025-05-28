import React, { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import ModalQR from "../components/ModalQR";
import TextField from "../../../../components/TextField";
import { io } from 'socket.io-client';
import UploadImage from "../../../../components/UploadImage";
import Select from "react-select";
import { getCategoryAll as getCategoriesService } from "../../../../services/CategoryService";
import { getSupplierAll as getSuppliersService } from "../../../../services/SupplierService";
import { getTagAll as getTagsService } from "../../../../services/TagService";
import { RiQrScan2Line } from "react-icons/ri";
import { toast } from "react-toastify";

const isFieldDisable = (isEditMode) => isEditMode;
const SOCKET_SERVER_URL = import.meta.env.VITE_BARCODE_URL;

const ProductForm = ({
  formData,
  setFormData,
  handleChange,
  handleChangeImage,
  handleChangeTags,
  handleSubmit,
  handleCancel,
  isEditMode,
}) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [tags, setTags] = useState([]);
  const [optionsTags, setOptionsTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [showQRModal, setShowQRModal] = useState(false);
  // WS y sesión
  const sessionIdRef = localStorage.getItem("barcode");
  console.log("barcode inicial:", sessionIdRef)

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
    const fetchSuppliers = async () => {
      try {
        const response = await getSuppliersService();
        setSuppliers(response);
      } catch (error) {
        toast.error("Error cargando los proveedores", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchSuppliers();

  }, [])

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

        if (formData.ProductTag) {
          const mappedTags = formData.ProductTag.map((item) => ({
            value: item.tag.id,
            label: item.tag.name,
          }));

          setSelectedTags(mappedTags);
        }
      } catch (error) {
        toast.error("Error cargando las etiquetas", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (isEditMode && formData.images) {

      const existingImages2 = formData.images.map((image) => ({
        data_url: image.url,
        id: image.id,
        isExisting: true,
      }));

      setFormData({
        ...formData,
        images: formData.images.map((image) => ({
          data_url: image.url,
          id: image.id,
          isExisting: true,
        })),
      })

      const existingImages = formData.images.map((image) => ({
        data_url: image.url,
        id: image.id,
        isExisting: true,
      }));

      setImages(existingImages);
      setExistingImages(existingImages);
    }
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
    const existingImages = imageList.filter((image) => image.isExisting);
    const newImages = imageList.filter((image) => !image.isExisting);

    const newImageObjects = newImages.map((image, index) => {
      if (image.file) {
        return {
          file: image.file,
          id: undefined,
          data_url: image.data_url,
          isExisting: false
        };
      } else {
        return {
          file: base64ToFile(image.data_url, `image-${index}.jpg`),
          id: undefined,
          data_url: image.data_url,
          isExisting: false
        };
      }
    });

    const allImages = [...existingImages, ...newImageObjects];
    setImages(allImages);
    handleChangeImage(allImages);
  };

  const handleTags = (value) => {
    handleChangeTags(value);
    setSelectedTags(value);
  };

  useEffect(() => {
    const sock = io(SOCKET_SERVER_URL);
    sock.on("connect", () => {
      sock.emit("join-room", sessionIdRef);
      console.log("como se conecta", sessionIdRef)
    });

    sock.on("scan", productBarcode => {
      console.log("Código escaneado recibido:", productBarcode);
      setFormData(prev => ({
        ...prev,
        barcode: productBarcode,
      }));
    });
    //return () => sock.disconnect();
  }, []);

  return (
    <>
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
              placeholder="Ingrese el nombre del producto"
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
              placeholder="Ingrese descripción del producto"
              className="p-3 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="price"
              className="text-md font-medium w-70"
            >
              Precio
            </label>
            <TextField
              id="price"
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="bg-gray-200"
              placeholder="Ingrese el precio"
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="text-md font-medium w-70 h-40">
              Categoría
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
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
            <label htmlFor="supplierId" className="text-md font-medium w-70 h-40">
              Proveedor
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="border rounded-md p-3 bg-gray-200 w-full"
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers
                .filter((supplier) => supplier.status === "ACTIVE")
                .map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="barcode">Código de barra</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Ej. 00001"
              className="border rounded p-2 flex-1"
            />
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="text-2xl text-gray-700 hover:text-blue-600"
            >
              <RiQrScan2Line />
            </button>
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
              placeholder="Ej. 500mg"
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
              placeholder="Ej. Paracetamol"
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
              placeholder="Ej. 100g"
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
              placeholder="Ej. 250ml"
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
              value={selectedTags}
              isMulti
              onChange={handleTags}
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

        <div className="flex space-x-4 mt-4 ml-4">
          <Button type="submit" textColor="text-[#000000]" title="Agregar" color="bg-[#D0F25E]" />
          <Button
            type="button"
            title="Cancelar"
            color="bg-[#D0F25E]"
            textColor="text-[#000000]"
            onClick={handleCancel}
          />
        </div>
      </form>
      {showQRModal && (
        <ModalQR
          open={showQRModal}
          sessionIdRef={sessionIdRef}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  );
};

export default ProductForm;
