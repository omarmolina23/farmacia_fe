import mockAxios from "../config/axiosMock"; 

function verifyUrl() {
    const apiUrl = import.meta.env.VITE_MOCK_URL;
    if(!apiUrl) {
        throw new Error();
    }
}
export const getSalesAll = async () => {
    try {   
        verifyUrl();
        const response = await mockAxios.get("/sales");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

/*

export const getProductAll = async () => {
    try {   
        verifyUrl();
        const response = await mockAxios.get("/product/for-sale");
        console.log("response", response);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al obtener el estado diario");
    }
};

*/