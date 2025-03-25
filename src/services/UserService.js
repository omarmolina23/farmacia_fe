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
