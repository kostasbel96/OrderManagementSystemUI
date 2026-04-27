export const getApiUrl = () => {
    return localStorage.getItem("apiUrl") || import.meta.env.VITE_API_URL;
};