import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Normalize errors so UI never crashes on unexpected shapes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && typeof error.response.data !== "object") {
            error.response.data = {
                message: "Server error. Please try again in a moment.",
            };
        }
        return Promise.reject(error);
    }
);

export default api;