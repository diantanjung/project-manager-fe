import axios from "axios";

// Read API URL from env or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadService = {
    uploadFile: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
