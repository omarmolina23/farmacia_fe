import axios from '../config/axios';

export const login = async (email, password) => {
    try {
        const response = await axios.post('/auth/login', { email, password });

        const { token, name, isAdmin, status } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ name, isAdmin, status }));

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Ha ocurrido un error");
    }
};

export const signUp = async (userData) => {
    const response = await axios.post('/auth/sign-up', userData);
    return response.data;
};

export const signOut = async () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        localStorage.removeItem('factus_access_token');
        localStorage.removeItem('factus_refresh_token');

        localStorage.removeItem("sessionId");

        await axios.post('auth/sign-out');
    }
    catch (error) {
        throw new Error(error.response?.data?.message || "Ha ocurrido un error");
    }
};


export const setPassword = async (token, password) => {
    try {
        const response = await axios.post(`/auth/set-password?token=${token}`, { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    }
    catch (error) {
        throw new Error(error.response.data.message || "Ha ocurrido un error");
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post('/auth/forgot-password', { email });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post('/auth/refresh-token');
        return response.data;
    }
    catch (error) {
        throw new Error(error.response.data.message || "Ha ocurrido un error");
    }
}

export const getUserAll = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/users/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const searchUser = async (query) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/users/search`, {
            params: { query },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error searching for User");
    }
};

export const updateUser = async (id, updateData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`/users/${id}`, updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al desactivar el usuario');
    }
};

export const deleteUser = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/users/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al desactivar el usuario');
    }
};