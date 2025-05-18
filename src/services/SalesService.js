import axios from "../config/axios";

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
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const getSalesId = async (id) => {
    try {   
        verifyUrl();
        const response = await axios.get(`/sales/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};