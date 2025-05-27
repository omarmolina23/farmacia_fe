import axios from "../config/axios";

function verifyUrl() {
    const apiUrl = import.meta.env.VITE_MOCK_URL;
    if(!apiUrl) {
        throw new Error();
    }
}
export const getDailyStatus = async () => {
    try {   
        verifyUrl();
        const response = await axios.get("/dashboard/daily-status");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const getMinimumStock = async () => {
    try {
        verifyUrl();
        const response = await axios.get("/dashboard/minimum-stock");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el stock mínimo");
    }
};

export const getProductsSold = async () => {
    try {
        verifyUrl();
        const response = await axios.get("/dashboard/products-sold");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener los productos vendidos"
        );
    }
};

export const getRecentSales = async () => {
    try {
        verifyUrl();
        const response = await axios.get("/dashboard/recent-sales");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener las ventas recientes"
        );
    }
};

export const getSalesByCategory = async () => {
    try {
        verifyUrl();
        const response = await axios.get("/dashboard/sales-category");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener ventas por categoría"
        );
    }
};

export const getProfitByCategory = async () => {
    try {
        verifyUrl();
        const response = await axios.get("/dashboard/profit-category");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener ganancias por categoría"
        );
    }
};
