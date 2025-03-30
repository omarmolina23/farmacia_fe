import axios from "../config/axios";

export const createSupplier = async (SupplierData) => {
  try {
    const response = await axios.post("/supplier", SupplierData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ha ocurrido un error");
  }
};
export const getCategoryAll = async () => {
  try {
    const response = await axios.get(`/category`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ha ocurrido un error");
  }
};

export const searchCategory = async (query) => {
  try {
    const response = await axios.get(`/category/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ha ocurrido un error");
  }
};

export const updateCategory = async (id, SupplierData) => {
  try {
    const response = await axios.patch(`/category/${id}`, SupplierData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ha ocurrido un error");
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`/category/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ha ocurrido un error");
  }
};
