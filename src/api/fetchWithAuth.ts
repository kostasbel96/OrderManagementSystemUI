export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return response;
};