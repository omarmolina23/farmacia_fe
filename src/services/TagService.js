import axios from "../config/axios";

export const getTagAll = async () => {
    try {
        const response = await axios.get(`/tags`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
}