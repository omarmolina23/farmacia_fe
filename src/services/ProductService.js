import axios from "../config/axios";

export const createProduct = async (productData) => {
    try {
        const response = await axios.post("/product", productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const getProductAll = async () => {
    try {
        const response = await axios.get("/product");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const searchProductByNameOrId = async (query) => {
    try {
        const response = await axios.get(`/product/search`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const searchProductByName = async (query) => {
    try {
        const response = await axios.get(`/product/search/name`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const updateProduct = async (id, productData) => {
    console.log("productData", productData);
    try {
        const response = await axios.patch(`/product/${id}`, productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`/product/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}


export const filterProduct = async (params) => {
    try {
        const response = await axios.get(`/product/filter`, {
            params
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}