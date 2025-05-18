import axios from "../config/axios";

export const getSalesAll = async () => {
    try {
        const response = await axios.get("/sales");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const createSale = async (sale) => {
    try {
        const response = await axios.post("/sales", sale);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const returnSale = async (sale_id, sale) => {
    try {
        const response = await axios.patch(`/sales/return/${sale_id}`, sale);
        console.log("Respuesta de la API:", response);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const getSalesId = async (id) => {
    try {
        const response = await axios.get(`/sales/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const getSalesFiltered = async ({ startdate, enddate } = {}) => {
    try {
        const params = new URLSearchParams();

        if (startdate) params.append("startdate", startdate);
        if (enddate) params.append("enddate", enddate);

        const queryString = params.toString() ? `?${params.toString()}` : "";

        const response = await axios.get(`/sales${queryString}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener las ventas filtradas"
        );
    }
};
