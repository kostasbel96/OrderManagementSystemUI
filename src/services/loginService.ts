import {getApiUrl} from "../helper/IpHelper.ts";

const API_URL = getApiUrl();

export async function loginUser(username: string, password: string): Promise<string> {
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