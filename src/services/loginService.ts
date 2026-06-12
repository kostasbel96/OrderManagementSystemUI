import {useUIStore} from "../hooks/store/useUIStore.ts";

export async function loginUser(username: string, password: string): Promise<string> {
    const { url } = useUIStore.getState();
    const API_URL = url;
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Wrong username or password");
    }
    return  await response.text();
}