import axios from "axios";
import { refreshAccessToken } from "../services/FactusService";

const factusAxios = axios.create({
    baseURL: import.meta.env.VITE_FACTUS_URL,
});

factusAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("factus_access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

factusAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("factus_refresh_token");
                const refreshed = await refreshAccessToken(refreshToken);

                // Guardar ambos tokens actualizados
                localStorage.setItem("factus_access_token", refreshed.access_token);
                localStorage.setItem("factus_refresh_token", refreshed.refresh_token);

                // Reintentar solicitud original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${refreshed.access_token}`;
                return factusAxios(originalRequest);
            } catch (refreshError) {
                console.error("Fallo al refrescar el token:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default factusAxios;
