import axios from "axios";

const magicLoopAPI = axios.create({
    baseURL: import.meta.env.VITE_MAGIC_LOOP_URL, // Usamos la variable de entorno
    headers: {
        "Content-Type": "application/json",
    },
});

export default magicLoopAPI;
