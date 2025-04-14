import axios from "axios";

const mockAxios = axios.create({
    baseURL: import.meta.env.VITE_MOCK_URL,
});

export default mockAxios;
