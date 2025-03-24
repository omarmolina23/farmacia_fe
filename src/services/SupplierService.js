import axios from "../config/axios";

export const createSupplier = async (SupplierData) => {
    try {
        const response = await axios.post("/supplier", SupplierData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error creating Supplier");
    }
};
export const getSupplierAll = async () => {
    try {
        const response = await axios.get(`/supplier`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching Supplier");
    }
};

export const searchSupplier = async (query) => {
    try {
        const response = await axios.get(`/supplier/search`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error searching for Supplier");
    }
};

export const updateSupplier = async (id, SupplierData) => {
    try {
        const response = await axios.patch(`/supplier/${id}`, SupplierData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error updating Supplier");
    }
};

export const deleteSupplier = async (id) => {
    try {
        const response = await axios.delete(`/supplier/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error deleting Supplier");
    }
};