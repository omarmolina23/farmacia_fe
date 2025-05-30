import axios from "../config/axios";
import axiosForecast from '../config/axiosForecast';
import axiosMagicLoop from '../config/axiosMagicLoop';

const employee = JSON.parse(localStorage.getItem("user"));

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

export async function getForecastCategory(category) {
    try {
        const { data } = await axiosForecast.post("/forecast/category", { category });
        return data;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el forecast";
        throw new Error(msg);
    }
}

export async function getForecastProduct(product_id) {
    try {
        const { data } = await axiosForecast.post("/forecast/product", { product_id });
        return data;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el forecast";
        throw new Error(msg);
    }
}

export async function getPrescriptiveProduct(context, productName) {
    const payload = {
        question: `Soy el empleado ${employee.name}, realiza un análisis prescriptivo sobre el producto ${productName}, rápido, sintetizado y entendible. ` +
            `Limita tu respuesta a máximo 280 caracteres.`,
        context,
    };

    try {
        const { data } = await axiosMagicLoop.post(
            "/run",
            payload
        );
        console.log("Prescriptive Analysis Data:", data.answer);
        return data.answer;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el análisis prescriptivo";
        throw new Error(msg);
    }
}

export async function getPrescriptiveCategory(context, categoryName) {
    const payload = {
        question: `Soy el empleado ${employee.name}, realiza un análisis prescriptivo sobre la categoría ${categoryName}, rápido, sintetizado y entendible. ` +
            `Limita tu respuesta a máximo 280 caracteres.`,
        context,
    };

    try {
        const { data } = await axiosMagicLoop.post(
            "/run",
            payload
        );
        console.log("Prescriptive Analysis Data:", data.answer);
        return data.answer;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el análisis prescriptivo";
        throw new Error(msg);
    }
}


