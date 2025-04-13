import axios from "axios";
import { refreshToken as refreshTokenService } from "../services/UserService";
import { signOut as signOutService } from "../services/UserService";
import {toast} from "react-hot-toast";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});


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
)

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("Origin request", originalRequest);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshTokenService();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);

            } catch (refreshError) {

                toast.error("Sesión expirada, por favor inicie sesión nuevamente")
                signOutService();
                window.location.href = "/";
                return Promise.reject(refreshError);

            }

        }
        return Promise.reject(error);
    }
);


export default instance;
