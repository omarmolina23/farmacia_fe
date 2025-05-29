import axios from "../config/axios";
import axiosForecast from '../config/axiosForecast';

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

export const updateSale = async (sale_id, data) => {
    try {
        const response = await axios.patch(`/sales/einvoice/${sale_id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error en updateSale:", error.response || error);
        throw new Error(
            error.response?.data?.message ||
            "Ha ocurrido un error al actualizar la venta"
        );
    }
};


export const returnSale = async (sale_id) => {
    try {
        const response = await axios.patch(`/sales/return/${sale_id}`);
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

export const getSalesFiltered = async ({ startDate, endDate, repaid } = {}) => {
    try {
        const params = new URLSearchParams();

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (repaid) params.append("repaid", repaid);

        const queryString = params.toString() ? `?${params.toString()}` : "";

        const response = await axios.get(`/sales/date-range${queryString}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error al obtener las ventas filtradas"
        );
    }
};


export const getSalesUser = async (user_id) => {
    try {
        const response = await axios.get(`/sales/user/${user_id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
}

export const generatePdf = async (sale_id) => {
    try {
        const response = await axios.get(`/sales/pdf/${sale_id}`, {
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
}

export async function getForecast(category, weeks = 4) {
    try {
        const { data } = await axiosForecast.post("/forecast", { category, weeks });
        return data;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el forecast";
        throw new Error(msg);
    }
}