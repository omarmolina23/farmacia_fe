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

export const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
