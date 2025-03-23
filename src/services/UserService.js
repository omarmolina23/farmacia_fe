import axios from '../config/axios';

export const login = async (email, password) => {
    try {
        console.log("email", email, "password", password);
        const response = await axios.post('/auth/login', { email, password });

        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
