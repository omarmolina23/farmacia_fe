import axios from "axios";

const mockAxios = axios.create({
    baseURL: "https://1ece7656-b9dd-4cc2-a0ea-dca234c3d4e7.mock.pstmn.io/api",
});

export default mockAxios;
