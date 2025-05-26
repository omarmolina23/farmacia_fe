import axios from "../config/axios";

export const createClient = async (client) => {
    try {
        const response = await axios.post("/client", client);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
};


export const getClientAll = async () => {
    try {
        const response = await axios.get("/client");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

export const searchClientById = async (id) => {
    try {
        const response = await axios.get(`/client/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}

export const sendCodeVerification = async ({ email }) => {
    try {
        const response = await axios.post('/client/send-code', { email });
        return response;
        
    } catch (error) {
        console.error("Error al enviar código:", error.response);
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Ha ocurrido un error al enviar el código de verificación"
        );
    }
};

