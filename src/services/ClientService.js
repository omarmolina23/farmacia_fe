import mockAxios from "../config/axiosMock"; 

function verifyUrl() {
    const apiUrl = import.meta.env.VITE_MOCK_URL;
    if(!apiUrl) {
        throw new Error();
    }
}
export const getClientAll = async () => {
    try {   
        verifyUrl();
        const response = await mockAxios.get("/client");
        console.log("response", response);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};