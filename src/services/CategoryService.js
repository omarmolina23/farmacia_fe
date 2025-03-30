import axios from "../config/axios";

export const createCategory = async (category) => {
  try {
    const response = await axios.post("/category", category);
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

export const updateCategory = async (id, category) => {
  try {
    const response = await axios.patch(`/category/${id}`, category);
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
