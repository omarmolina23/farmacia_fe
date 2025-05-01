import axios from '../config/axios';

export const createBatch = async (batchData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/batch', batchData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Ha ocurrido un error');
    }
};

export const getAllBatches = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/batch', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Ha ocurrido un error');
    }
};

export const searchBatchByNumber = async (query) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/batch/search', {
            params: { query },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al buscar el lote');
    }
};

export const getBatchesByProductId = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/batch/search/by-product', {
            params: { productId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al buscar lotes por producto');
    }
};

export const updateBatch = async (id, updateData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`/batch/${id}`, updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el lote');
    }
};

export const deactivateBatch = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/batch/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al desactivar el lote');
    }
};