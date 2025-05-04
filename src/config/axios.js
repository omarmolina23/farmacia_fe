import axios from "axios";
import { refreshToken as refreshTokenService } from "../services/UserService";
import { signOut as signOutService } from "../services/UserService";
import { toast } from "react-toastify";

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
);


export default instance;
