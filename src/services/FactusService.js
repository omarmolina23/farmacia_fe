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
                // Authorization ya se gestiona automáticamente por el interceptor
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al crear/validar la factura:", error.response?.data || error.message);
        throw error;
    }
};
