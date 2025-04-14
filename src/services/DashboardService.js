import axios from "axios";

export const getDailyStatus = async () => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/e3e18c9e-1fb3-430f-ba40-31af0bf12543");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const getMinimumStock = async () => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/deb503d6-1651-4bbe-9641-be4aeef69038");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el stock mínimo");
    }
};

export const getProductsSold = async () => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/610bbd6c-9eca-4aa3-a545-7f0b46dfd66f");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener los productos vendidos"
        );
    }
};

export const getRecentSales = async () => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/4165e1a9-5d7f-4601-88b4-ea147fe44ba8");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener las ventas recientes"
        );
    }
};

export const getSalesByCategory = async () => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/b325fabd-a948-480d-b7f0-3bdae9aa4e1f");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener ventas por categoría"
        );
    }
};

export const getProfitByCategory = async () => {
    try {
        const response = await axios.get("https://run.mocky.io/v3/eb5d37eb-f993-4c2c-8fc1-33d4f24e319e");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener ganancias por categoría"
        );
    }
};
