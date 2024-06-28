import axios from "axios";
import appSettings from "./appSetings.json";

const api = axios.create({
    baseURL: appSettings.API_URL,
    headers: {
        "Content-Type": "application/json",
        'Accept': '*/*',
    },
});

api.interceptors.request.use(async (config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    async function (response) {
        if (
            response?.status === 422 ||
            response?.status === 201 ||
            response?.status === 200 ||
            response?.status === 204 ||
            response?.status === 400
        ) {
            return response;
        }
        
        return Promise.reject(response);
    }, function (error) {
        return error;
    }
);

export default api;