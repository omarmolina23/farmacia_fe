import axios from "axios";
import { refreshToken as refreshTokenService } from "../services/UserService";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

/*
instance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {

                const newToken = await refreshTokenService();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);

            } catch (refreshError) {

                console.error("Error while refreshing token", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
                return Promise.reject(refreshError);

            }

        }
        return Promise.reject(error);
    }
);*/


export default instance;
