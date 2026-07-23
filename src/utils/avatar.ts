export const getFullAvatarUrl = (url?: string | null): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");
    const baseUrl = apiUrl.replace(/\/api(\/v1)?$/, "");
    return `${baseUrl}${url}`;
};
