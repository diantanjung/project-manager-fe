import { api } from "../lib/axios";

export const uploadService = {
    uploadFile: async (file: File, userId?: number): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await api.post(`/users/${userId ?? "me"}/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
