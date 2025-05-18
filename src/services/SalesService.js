import mockAxios from "../config/axiosMock"; 
import axios from "../config/axios";

function verifyUrl() {
    const apiUrl = import.meta.env.VITE_MOCK_URL;
    if(!apiUrl) {
        throw new Error();
    }
}

export const getSalesAll = async () => {
    try {   
        const response = await axios.get("/sales"); 
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const createSale = async (sale) =>{
    try {
        const response = await axios.post("/sales", sale);
        return response.data;
    } catch (error) {
        console.error("error", error);
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const getSalesId = async (sales_reference_id) => {
    try {   
        verifyUrl();
        const response = await mockAxios.get(`/return/${sales_reference_id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};