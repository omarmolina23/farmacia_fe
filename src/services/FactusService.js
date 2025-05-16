import factusAxios from "../config/axiosFactus";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const USERNAME = import.meta.env.VITE_USERNAME;
const PASSWORD = import.meta.env.VITE_PASSWORD;

export const getAccessToken = async () => {
    const data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('username', USERNAME);
    data.append('password', PASSWORD);

    try {
        const response = await factusAxios.post('/oauth/token', data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log("factus_access_token", response.data.access_token)
        localStorage.setItem("factus_access_token", response.data.access_token);
        localStorage.setItem("factus_refresh_token", response.data.refresh_token);
        return response.data;
        
    } catch (error) {
        console.error('Error al obtener token:', error.response?.data || error.message);
        throw error;
    }
};

export const refreshAccessToken = async (refreshToken) => {
    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('refresh_token', refreshToken);

    try {
        const response = await factusAxios.post('/oauth/token', data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al refrescar token:', error.response?.data || error.message);
        throw error;
    }
};

export const createInvoice = async (invoiceData) => {
    try {
        const response = await factusAxios.post('/v1/bills/validate', invoiceData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        const errorData = error.response?.data;

        if (errorData?.data?.errors) {
            console.error("❌ Errores de validación de Factus:");
            for (const [field, messages] of Object.entries(errorData.data.errors)) {
                console.error(`→ ${field}: ${messages.join(", ")}`);
            }
        } else {
            console.error("⚠️ Error general al crear/validar la factura:", errorData || error.message);
        }

        throw error;
    }
};

export const createCreditNote = async (creditNoteData) => {
    try {
        const response = await factusAxios.post('/v1/credit-notes/validate', creditNoteData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 422 && errorData?.errors) {
            console.error("❌ Errores de validación de Factus:");
            for (const [field, messages] of Object.entries(errorData.errors)) {
                console.error(`→ ${field}: ${messages.join(", ")}`);
            }

            // Puedes retornar un objeto con los errores para mostrar en UI si lo deseas
            throw new Error("Errores de validación. Revisa los campos y vuelve a intentar.");
        }

        if (status === 409 && Array.isArray(errorData?.errors)) {
            const conflictMsg = errorData.errors.map(e => e.message).join(" | ");
            console.error(`⚠️ Conflicto al crear nota crédito: ${conflictMsg}`);
            throw new Error(`Conflicto: ${conflictMsg}`);
        }

        // Otros errores
        console.error("⚠️ Error general al crear/validar la nota crédito:", errorData || error.message);
        throw new Error("Ocurrió un error inesperado al validar la nota crédito.");
    }
};


