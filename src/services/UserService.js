import axios from '../config/axios';

export const login = async (email, password) => {
    try {
        const response = await axios.post('/auth/login', { email, password });

        const { token, name, isAdmin, status } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ name, isAdmin, status }));

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const signUp = async (userData) => {
    try {
        const response = await axios.post('/auth/sign-up', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export const setPassword = async (token, password) => {
    try {
        const response = await axios.post(`/auth/set-password?token=${token}`, { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log(response)
        return response.data;
    }
    catch (error) {
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
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