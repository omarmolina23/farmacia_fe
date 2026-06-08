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

export async function getForecastProductAll() {
    try {
        const { data } = await axiosForecast.get("/cached/forecast/product");
        return data;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el forecast";
        throw new Error(msg);
    }
}

export async function getForecastCategoryAll() {
    try {
        const { data } = await axiosForecast.get("/cached/forecast/category");
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
        question: `realiza un análisis prescriptivo sobre el producto ${productName}, rápido, sintetizado y entendible. ` +
            `Limita tu respuesta a máximo 280 caracteres.`,
        context,
    };

    try {
        const { data } = await axios.post("/ai/run", payload);
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
        question: `realiza un análisis prescriptivo sobre la categoría ${categoryName}, rápido, sintetizado y entendible. ` +
            `Limita tu respuesta a máximo 280 caracteres.`,
        context,
    };

    try {
        const { data } = await axios.post("/ai/run", payload);
        return data.answer;
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener el análisis prescriptivo";
        throw new Error(msg);
    }
}

// Presupuesto máximo (en bytes) para el cuerpo enviado al backend de IA.
// Reduce el costo y evita límites de tamaño/tokens compactando el historial
// de cada forecast hasta quedar por debajo del presupuesto.
const MAX_CONTEXT_BYTES = 80_000;

function jsonBytes(value) {
    return new TextEncoder().encode(JSON.stringify(value)).length;
}

function trimSeries(arr, max) {
    if (!Array.isArray(arr)) return arr;
    if (max <= 0) return [];
    return arr.length > max ? arr.slice(-max) : arr;
}

function compactForecasts(forecasts, maxHistory, maxForecast) {
    if (!Array.isArray(forecasts)) return forecasts;
    return forecasts.map((f) => {
        if (!f || typeof f !== "object") return f;
        const compact = { ...f };
        if (Array.isArray(f.history)) compact.history = trimSeries(f.history, maxHistory);
        if (Array.isArray(f.forecasting)) compact.forecasting = f.forecasting.slice(0, maxForecast);
        return compact;
    });
}

// Recorta el contexto de forma adaptativa: solo reduce lo necesario para
// mantener el cuerpo bajo MAX_CONTEXT_BYTES. Catálogos pequeños no se tocan.
function compactContext(context, budget = MAX_CONTEXT_BYTES) {
    if (!context || !Array.isArray(context.forecasts)) return context;
    if (jsonBytes(context) <= budget) return context;

    // 1) Reducir progresivamente la ventana de historial por forecast.
    for (const maxHistory of [12, 8, 6, 4, 0]) {
        const candidate = { ...context, forecasts: compactForecasts(context.forecasts, maxHistory, 8) };
        if (jsonBytes(candidate) <= budget) return candidate;
    }

    // 2) Último recurso: limitar la cantidad de forecasts incluidos.
    const base = { ...context, forecasts: compactForecasts(context.forecasts, 0, 8) };
    const forecasts = [...base.forecasts];
    while (forecasts.length > 1 && jsonBytes({ ...base, forecasts }) > budget) {
        forecasts.pop();
    }
    return { ...base, forecasts };
}

export async function getAiAssistant(payload) {
    const compactPayload = payload?.context
        ? { ...payload, context: compactContext(payload.context) }
        : payload;
    try {
        const { data } = await axios.post("/ai/run", compactPayload);
        return data.answer;
    } catch (err) {
        if (err.response?.status === 413) {
            throw new Error(
                "El contexto es demasiado grande para la IA. Intenta una pregunta más específica."
            );
        }
        const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Error al obtener asistencia de IA";
        throw new Error(msg);
    }
}

