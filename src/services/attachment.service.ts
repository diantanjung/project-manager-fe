import axios from "axios";
import type { Attachment } from "../types/attachment";

const API_URL = "http://localhost:3000/api"; // Hardcoded for now, should be env

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const attachmentService = {
    getAttachments: async (taskId: number): Promise<Attachment[]> => {
        const response = await axios.get(`${API_URL}/tasks/${taskId}/attachments`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    uploadAttachment: async (taskId: number, file: File): Promise<Attachment> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${API_URL}/tasks/${taskId}/attachments`, formData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteAttachment: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/attachments/${id}`, {
            headers: getAuthHeader(),
        });
    },
};
